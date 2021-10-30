import React, { FC } from "react";
import { Layout } from "../components/core/layout";
import { useMyEnvs } from "../components/my-envs/my-envs";
import { RequireLogin } from "../components/require-login";
import { SpinLoading } from '../components/spin-loading';
import { CardEnv } from './card-env';
import { ButtonConfirmation } from "../components/theme/button-confirmation";

const MyEnvs: FC = () => {
  const { createNewEnv: createEnv, snapDocs, loading, load } = useMyEnvs();
  load();

  return <Layout>
    <RequireLogin>
      <div className="container px-4 pb-8">
        <div className="pb-4">
          <ButtonConfirmation typeStyle="primary" onClick={createEnv}>Create new env</ButtonConfirmation>
        </div>

        <div className="max-w-5xl m-auto">
          <SpinLoading loading={loading} className="space-y-4">
            {snapDocs.map(doc => <CardEnv key={doc.id} envDoc={doc}></CardEnv>)}
          </SpinLoading>
        </div>
      </div>
    </RequireLogin>
  </Layout >
}

export default MyEnvs;
