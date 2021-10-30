import { useRouter } from "next/router";
import React, { FC } from "react";
import { Layout } from "../../components/core/layout";
import { RequireLogin } from "../../components/require-login";
import { useBodyEnv } from "../../components/use-body-env";
import { Button } from "../../components/theme/button";
import Link from 'next/link'
import { SpinLoading } from "../../components/spin-loading";
import { Input } from "../../components/theme/input";
import { ValuesForm } from "../../components/theme/types/values-form";
import { Form, useForm } from "../../components/theme/form";
import { Editor } from "../../components/theme/editor";


const EditEnv: FC = () => {
  const router = useRouter()
  const env = typeof router.query.env === 'string' ? router.query.env : null;
  const { readingLoading, data, updateData, writingLoading } = useBodyEnv(env ?? undefined)
  const form = useForm();

  return <>
    <Layout>
      <RequireLogin>
        <SpinLoading loading={readingLoading} key={readingLoading ? '1' : '2'}>
          <Form initialValue={data} form={form}>
            <div className="container px-4 space-y-4">
              <Input name="title" label="Title"/>

              <hr />

              <Editor name="payload" />

              <hr />

              <div className="space-x-4">
                <Button
                  typeStyle="primary"
                  onClick={() => updateData(form.values)}
                  loading={writingLoading}
                  disabled={writingLoading}
                >Guardar</Button>

                <Link href="/my-envs">
                  <Button>Volver</Button>
                </Link>
              </div>
            </div>
          </Form>
        </SpinLoading>
      </RequireLogin>
    </Layout>
  </>
}

export default EditEnv;
