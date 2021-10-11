import { FC, useEffect, useRef } from "react";
import { Layout } from "../components/core/layout"
import Editor, { useMonaco } from "@monaco-editor/react"
import { Registry } from "monaco-textmate";
import { tmLanguage } from "../tmLanguage";

const demoCode = `# .envuse
##############################
# Demo file for .envuse
##############################

###
# Comment descriptive
###
API_KEY           = cf7d6f43-bb85-4045-a23f-7fb94bfac745 # API key UUIDv4
DB_HOST           = 127.7.0.1
DB_PORT : number  = 5432 # Database port
DB_USER           = postgres
DB_PASSWORD       = postgres
DB_NAME           = postgres

#; if SHELL_SYSTEM  ===  'windows'  ===  1_232.3_21_12 === A.D.V
COLOR_TERM : boolean = false
#; fi

#; if NODE_ENV  ===  'production'
FORCE_URL_SSL =  true
#; fi

# single comment
  A=123 # # asd
      ###
No 123
###
`;

const Playground: FC = () => {
  const monaco = useMonaco()
  const divEditor = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (monaco) {
    }
  }, [monaco])

  return <Layout>
    <Editor
      height="100vh"
      language="envuse"
      onChange={(val) => {
        console.log(val)
      }}
      defaultValue={demoCode}
    />
  </Layout>
}

export default Playground;
