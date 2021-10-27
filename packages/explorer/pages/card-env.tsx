import React, { FC } from "react";
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import { toEnvDoc } from './toEnvDoc';
import { Button } from './theme/button';
import { ButtonConfirmation } from "./theme/button-confirmation";
import { dateFormatStr } from "./dateFormatStr";
import { useMyEnvs } from "../components/my-envs/my-envs";

const none = () => { }

export const CardEnv: FC<{ envDoc: DocumentSnapshot<DocumentData>; }> = ({ envDoc }) => {
  const { deleteEnv } = useMyEnvs();
  const data = toEnvDoc(envDoc.data());

  return <div className="border rounded-lg py-4 px-4 shadow-sm hover:shadow-md">
    <div><span className="text-sm text-gray-400">ID <code>{envDoc.id}</code></span></div>
    <div>{data?.title ?? <span className="text-gray-300">Sin titulo</span>}</div>
    {data?.createdAt &&
      <div><span className="font-light text-sm text-gray-600">Creado el {dateFormatStr(data?.createdAt)}</span></div>}
    <div className="space-x-3 pt-3 flex justify-start">
      <Button size="small" onClick={none}>Editar</Button>
      <ButtonConfirmation size="small" onClick={() => deleteEnv(envDoc.id)}>Eliminar</ButtonConfirmation>
    </div>
  </div>;
};
