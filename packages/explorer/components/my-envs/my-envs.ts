import { createDynamicHook } from "../create-dynamic-hook";
import { useUser } from "../firebase/user";
import { useEffect, useState } from "react";
import {
  deleteDoc,
  getDocs,
  getDoc,
  addDoc,
  orderBy,
  limit,
  query,
  doc,
  collection,
  DocumentData,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firestore";
import { storage } from "../firebase/storage";
import {
  uploadBytes,
  ref,
  updateMetadata,
  deleteObject,
} from "firebase/storage";

const useMyEnvsHook = () => {
  const [nFetched, setNFetched] = useState(0);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [snapDocs, setSnapDocs] = useState<DocumentSnapshot<DocumentData>[]>(
    []
  );
  const { user } = useUser();

  const load = () => {
    if (!loaded) {
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (user && loaded) {
      setLoading(true);
      (async () => {
        const myEnvsDoc = await getDocs(
          query(
            collection(db, "envs", user.uid, "envs"),
            orderBy("createdAt", "desc"),
            limit(20)
          )
        );
        setSnapDocs(myEnvsDoc.docs);
        setLoading(false);
      })();
    }
  }, [user, loaded, nFetched]);

  const createNewEnv = async () => {
    if (user) {
      setCreatingLoading(true);
      const c = collection(db, "envs", user.uid, "envs");

      const res = await addDoc(c, {
        myEnvs: 3,
        createdAt: new Date(),
      });

      await uploadBytes(
        ref(storage, `envs/${user.uid}/${res.id}`),
        Buffer.from("ok"),
        {
          contentType: "application/envuse",
          contentEncoding: "utf8",
          customMetadata: {
            userId: user.uid,
          },
        }
      );

      const reg = await getDoc(doc(db, res.path));

      setCreatingLoading(false);
      setSnapDocs(() => [reg, ...snapDocs]);
      console.log(res);
    }
  };

  const deleteEnv = async (envId: string) => {
    if (user) {
      const c = doc(db, "envs", user.uid, "envs", envId);
      await deleteObject(ref(storage, `envs/${user.uid}/${envId}`));
      const res = await deleteDoc(c);
      setSnapDocs((snapDocs) => snapDocs.filter((doc) => doc.id !== envId));
      console.log(res);
    }
  };

  return {
    creatingLoading,
    load,
    loading,
    snapDocs,
    createNewEnv,
    deleteEnv,
  };
};

const hook = createDynamicHook(useMyEnvsHook);

export const useMyEnvs = hook.useHook;
export const MyEnvsProvider = hook.Provider;
