import React, { FC, useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import { EnvuseFileParser } from 'envuse/src/lib/envuse-file/envuse-file-parser'
import { UnexpectedTokenError } from 'envuse/src/lib/envuse-file/statements/UnexpectedTokenError'
import util from 'util'
import { Base } from 'envuse/src/lib/envuse-file/statements/Base'
import { Block } from 'envuse/src/lib/envuse-file/statements/Root'

const Load: FC = ({ children }) => {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])

    if (loaded) return <>{children}</>
    return null
}

const withLocalStorage = typeof globalThis.localStorage === 'object'

const bmem = () => {
    const initial = withLocalStorage ? globalThis.localStorage.getItem('buff') : undefined

    const change = (newValue: string) => {
        if (withLocalStorage && initial !== newValue) {
            globalThis.localStorage.setItem('buff', newValue)
        }
    }

    return [initial, change] as const
}

const App: FC = () => {
    const [elmIndexSelected, setElmIndexSelected] = useState(-1)
    const [initial, change] = bmem()

    const [src, setSrc] = useState(initial ?? '');

    change(src)

    const load = useMemo(() => {
        try {
            const a = new EnvuseFileParser('a', Buffer.from(src))

            return a.toAstBody()
        } catch (err) {
            if (UnexpectedTokenError.isUnexpectedTokenError(err)) return err;
            throw err
        }
    }, [src])

    const elms = useMemo(() => {
        if (load instanceof Base) {
            return load.elementList.map((elm, index) => [index, elm] as const)
        }
        return null
    }, [load])

    const treeElms = useMemo(() => {
        if (elms && load instanceof Block) {
            return Array.from(load.body).reduce((acum, char, index) => {
                const elmsStart = elms.filter(([, elm]) => elm.pos === index)
                const elmsEnd = elms.filter(([, elm]) => elm.end === index)

                elmsEnd.forEach(() => {
                    acum += `</span>`
                })

                elmsStart.forEach(([index, elm]) => {
                    acum += `<span class="${index === elmIndexSelected ? 'selected' : ''}" x-elm-id="${index}" x-elm-name="${elm.constructor.name}">`
                })


                acum += Buffer.from([char]).toString()

                return acum
            }, '')
        }
        return null
    }, [elms, elmIndexSelected])


    const treeElmsTree = useMemo(() => {
        if (elms) {
            return <table>
                <tbody>
                    {elms.map(([index, elm]) => {
                        return <tr onMouseEnter={() => { setElmIndexSelected(index) }}><td>{index}</td><td>{elm.constructor.name}</td><td>{elm.pos}</td><td>{elm.end}</td></tr>
                    })}
                </tbody>
            </table>
        }
        return null
    }, [elms])

    return <>
        <style global jsx>{`
            .tree-elems .selected {
                background-color: #ffd710;
            }
        `}</style>

        <div>
            <Load><textarea name="" id="" cols="30" rows="10" defaultValue={src} onChange={t => setSrc(t.target.value)}></textarea></Load>
            <hr />
            <Load><pre className="tree-elems"><code dangerouslySetInnerHTML={{ __html: treeElms ?? '' }}></code></pre></Load>
            {treeElmsTree}
            <hr />
            <div>
                {load instanceof Error
                    ? <pre><code>{load.message}</code></pre>
                    : <pre><code>{util.inspect(load, false, Infinity)}</code></pre>
                }
            </div>
        </div>
    </>
}


export default App
