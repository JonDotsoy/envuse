import React, { ChangeEvent, FC, useRef, useState } from "react"
import { inspect } from 'util'
import { Store } from "../../lib/store";
import { AreaSelectable } from "../core/select";
import { Button } from "./button";
import { useContextForm } from "./hook/use-context-form.hook"
import { PlusSolid } from "./icons/solid/plus";
import { TrashSolid } from "./icons/solid/Trash";
import { Input } from "./input";

const initialTypes = ['string', 'number', 'boolean']

const typesStore = new Store([...initialTypes])

const InputAdd: FC<{ onAdd?: (val: string) => void }> = ({ onAdd }) => {
  const [value, setValue] = useState<string | null>(null)

  const onSubmit = () => {
    if (onAdd && value) {
      onAdd(value)
    }
  }

  return <>
    <form onSubmit={e => { e.preventDefault(); onSubmit(); }}>
      <div className="flex">
        <Input name="asd" onChange={e => setValue(e.target.value)} />
        <Button type="submit"><PlusSolid /></Button>
      </div>
    </form>
  </>
}


export const Editor: FC<{ name: string }> = ({ name }) => {
  const [types, setTypes] = typesStore.useHook(v => v);
  const { values } = useContextForm();

  const addType = (newType: string) => {
    setTypes(Array.from(new Set([...types, newType])));
  }

  const removeType = (type: string) => {
    setTypes(types.filter(t => t !== type));
  }

  const [fieldValue, setFieldValue] = useState<any[]>([]);

  const addField = () => {
    setFieldValue(fieldValue => [...fieldValue, { type: 'field' }]);
  }

  const m = (indexField: string, field: string) => {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFieldValue(values => {
        values[Number(indexField)][field] = event.target.value;
        return [...values];
      });
    }
  }

  return <>
    <h2 className="text-2xl">Configuraciones</h2>
    {Object.entries(fieldValue).map(([key, value]) => {
      return <div className="flex flex-row space-x-4 items-start">
        <Input name={`field-${key}-name`} onChange={m(key, 'name')} />
        <Input type="select" name={`field-${key}-type`} onChange={m(key, 'type')}>
          {types.map(
            type => <div key={type} x-value={type} className="border">
              <div className="flex items-center">
                <AreaSelectable className="flex-1 p-2" value={type}>{type}</AreaSelectable>
                {
                  !initialTypes.includes(type) &&
                  <div className="py-2 pr-2">
                    <Button onClick={() => removeType(type)}><TrashSolid /></Button>
                  </div>
                }
              </div>
            </div>
          )}
          <div className="p-2" key={types.length}>
            <InputAdd onAdd={t => addType(t)} />
          </div>
        </Input>
        <Input name={`field-${key}-value`} className="flex-1" onChange={m(key, 'value')} />
      </div>
    })}
    <div><Button size="small" onClick={addField}><PlusSolid /> Nueva fila</Button></div>
    <pre><code>{inspect({ types, fieldValue }, { depth: Infinity })}</code></pre>
  </>
}
