import { useEffect, useState } from "react";
import { useUser } from "./firebase/user";
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from "./firebase/firestore";


export const useBodyEnvWriting = (envId?: string) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [newData, updateData] = useState<any>(null);

  useEffect(() => {
    if (user && envId) {
      const docSel = doc(db, 'envs', user.uid, 'envs', envId);

      if (newData) {
        setLoading(true);
        const nextData = newData;
        updateData(null);
        updateDoc(docSel, nextData)
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [newData, envId, user]);

  return {
    loading,
    updateData,
  }
}


export const useBodyEnvReading = (envId?: string) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (user && envId) {
      const docSel = doc(db, 'envs', user.uid, 'envs', envId);

      setLoading(true);
      getDoc(docSel)
        .then(res => setData(res.data()))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, envId]);

  return {
    loading,
    data,
  };
};

export const useBodyEnv = (envId?: string) => {
  const { loading: readingLoading, data } = useBodyEnvReading(envId);
  const { loading: writingLoading, updateData } = useBodyEnvWriting(envId);

  return {
    readingLoading,
    writingLoading,
    data,
    updateData,
  }
}
