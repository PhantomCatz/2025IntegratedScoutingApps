import '../public/stylesheets/formItems.css';
import React, { useState, useRef, useEffect, } from 'react';
import { Input, Form, Select as AntdSelect, Checkbox, Flex, Button, Radio } from 'antd';

type StringMap<T> = Extract<keyof T, string>;
type NoInfer<T> = [T][T extends any ? 0 : never];

type AlignOptions = "left" | "center" | "right";

type NumberInputType<FieldType> = {
  title: any;
  name: StringMap<FieldType>;
  form: any;
  required?: boolean;
  message?: string;
  min?: number;
  max?: number;
  onChange?: (e? : number) => void;
  align?: AlignOptions;
  shown?: boolean;
  buttons?: boolean;
};
type SelectType<FieldType> = {
  title: any;
  name: StringMap<FieldType>;
  required?: boolean;
  message?: string;
  options: any[];
  onChange?: () => void;
  align?: AlignOptions;
  shown?: boolean;
  multiple?: boolean;
}

function NumberInput<FieldType>(props: NumberInputType<NoInfer<FieldType>>) {
  const title = props.title;
  const name = props.name;
  const form = props.form;
  const shown = props.shown ?? true;
  const required = (props.required ?? true) && shown;
  if((props.required ?? true) && !shown) {
    console.error("Required and not shown for", name)
  }
  const message = props.message ?? `Please input ${title}`;
  const min = props.min ?? 0;
  const max = props.max ?? Infinity;
  const onChange = props.onChange ?? (() => {});
  const align = props.align ?? "center";
  const buttons = props.buttons ?? true;

  const input = useRef(null);

  function updateInputValue(delta) {
    const newVal = (parseInt(input.current.value) || 0) + delta;
    if(newVal > max) {
      input.current.value = max;
    } else if(newVal < min) {
      input.current.value = min;
    } else {
      input.current.value = newVal;
    }
  }
  async function handleChange(e) {
    const newVal = e?.target?.value;
    await onChange(newVal);
  }

  return (
    <>
      {shown &&
        <div
          className="input input__number"
          style={{
            align: align,
          }}
        >
          {title &&
            <label
              style={{
                textAlign: align,
              }}
              htmlFor={name}
            >{title}</label>
          }
          <div>
            { buttons &&
              <button
                type="button"
                className="changeButton changeButton__decrement"
                onClick={ () => {
                  updateInputValue(-1);
                }}
              >-</button>
            }
            <input
              id={name}
              ref={input}
              type="number"
              className=""
              min={min}
              max={max}
              onChange={handleChange}
            />
            { buttons &&
              <button
                type="button"
                className="changeButton changeButton__increment"
                onClick={ () => {
                  updateInputValue(1);
                }}
              >+</button>
            }
          </div>
        </div>
      }
    </>
  );
}
function Select<FieldType>(props: SelectType<FieldType>) {
  const title = props.title;
  const name = props.name;
  const form = props.form;
  const shown = props.shown ?? true;
  const required = (props.required ?? true) && shown;
  if((props.required ?? true) && !shown) {
    console.error("Required and not shown for", name)
  }
  const message = props.message ?? `Please input ${title}`;
  const options = props.options;
  const onChange = props.onChange ?? (() => {});
  const align = props.align || "left";
  const multiple = props.multiple ? 'multiple' : undefined;

  return (
    <div
      style={{
        display: shown ? 'inherit' : 'none',
      }}
    >
      {title &&
        <label
          style={{
            textAlign: align as any,
          }}
          htmlFor={name}
        >{title}</label>
      }
      <Form.Item<FieldType>
        name={name as any}
        rules={[{ required: required, message: message }]}
      >
        <AntdSelect
          options={options}
          onChange={onChange}
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ maxHeight: 'none' }}
          mode={multiple}
          showSearch={false}
        />
      </Form.Item>
    </div>
  );
}

function ord(char : string) {
  return char.charCodeAt(0);
}
function toNumber(x : any) : number {
  if(typeof x === "number") {
    return x;
  }
  x = x || 0;
  const num = Number(x) || 0;
  return num;
}

export { NumberInput, Select, };
