import '../../public/stylesheets/formItems.css';
import React, { useState, useRef, useEffect, } from 'react';
import { Input, Form, Select as AntdSelect, Checkbox, Flex, Button, Radio } from 'antd';

type StringMap<T> = Extract<keyof T, string>;
type NoInfer<T> = [T][T extends any ? 0 : never];

type NumberInputType<FieldType> = {
  title: any;
  name: StringMap<FieldType>;
  required?: boolean;
  message?: string;
  min?: number;
  max?: number;
  onIncrease?: (e?: number) => void;
  onDecrease?: (e?: number) => void;
  onChange?: (e? : number) => void;
  form: any;
  align?: "left" | "center" | "right";
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
  align?: string;
  shown?: boolean;
  multiple?: boolean;
}

function NumberInput<FieldType>(props: NumberInputType<NoInfer<FieldType>>) {
  const title = props.title;
  const name = props.name;
  const shown = props.shown ?? true;
  const required = (props.required ?? true) && shown;
  if((props.required ?? true) && !shown) {
    console.error("Required and not shown for", name)
  }
  const message = props.message || `Please input ${title}`;
  const min = props.min ?? 0;
  const max = props.max ?? Infinity;
  const onIncrease = props.onIncrease || (() => {});
  const onDecrease = props.onDecrease || (() => {});
  const onChange = props.onChange || (() => {});
  const align = props.align || "center";
  const buttons = props.buttons ?? true;
  const form = props.form ?? undefined;

  const updateValue = (f : ((event : any) => void)) => {
    const oldVal = form.getFieldValue(name);
    
    const newVal = f(oldVal);

    form.setFieldValue(name, newVal);
  };

  const [value, setValue] = useState<number>(min);
  const [prevValue, setPrevValue] = useState<number>(min);

  useEffect(() => {
    if(prevValue < value) {
      onIncrease(value);
    } else if(prevValue > value) {
      onDecrease(value);
    }

    form.setFieldValue(name, value);

    onChange(value);
    setPrevValue(value);
  }, [value]);

  const handleChange : ((event: any) => void) = (() => {
    let id : any = null;

    return function(event : any) {
      window.clearTimeout(id);

      id = setTimeout(async () => {
        const newValue : string = event.nativeEvent.target.value;
        const num : number = toNumber(newValue);

        if(!num) {
          return;
        }

        let updatedNumber = 0;

        await updateValue((prevForm : any) => {
          const newVal : string = num.toString();

          const newNumber : number = Math.max(Math.min(toNumber(newVal), max), min);

          updatedNumber = newNumber;

          return updatedNumber;
        });

        setValue(updatedNumber);
          
      }, 50);
    }
  })();

  return (
    <Flex
      vertical
      align='flex-start'
      style={{
        display: shown ? 'inherit' : 'none',
      }}
      className={"numberInput"}
    >
      {title &&
        <h2
          style={{
            textAlign: align as any,
            width: "100%",
          }}
        >{title}</h2>
      }
      <Form.Item<FieldType>
        name={name as any}
        rules={[
          {
            required: required,
            message: message,
          },
          () => ({
            async validator(rule : any, value, callback) {
              if(required) {
                if(value < min) {
                  return Promise.reject(`${title} must be at least ${min}`);
                }
                if(value > max) {
                  return Promise.reject(`${title} must be at most ${max}`);
                }
              }

              return Promise.resolve();
            }
          })
        ]}
      >
        <Input
          id={name}
          type={"text"}
          inputMode={"numeric"}
          className={"input"}
          onKeyDown={(e) => {
            const key = e.keyCode;
            const acceptedKeys = [37, 38, 39, 40, 224];
            if((key >= 32 && !acceptedKeys.includes(key)) && ( key < ord("0") || key > ord("9"))) {
              console.log("prevented", key);
              e.nativeEvent.preventDefault();
            }
          }}
          onWheel={(e) => {
            (e.target as HTMLElement).blur();
          }}
          onKeyUp={handleChange}
          {...(buttons ? {
            addonBefore: (
              <Button
                className={"changeButton changeButton__decrement"}
                onMouseDown={async (form: any) => {
                  let updatedNumber = 0;

                  await updateValue((prevVal: any) => {
                    const val = toNumber(prevVal) - 1;

                    updatedNumber= Math.max(val, min);

                    return updatedNumber;
                  });
                  
                  await setValue(updatedNumber);
                }}
              >-</Button>
            ),
            addonAfter: (
              <Button
                className={"changeButton changeButton__increment"}
                onMouseDown={async () => {
                  let updatedNumber = 0;

                  await updateValue((prevVal : any) => {
                    const val = toNumber(prevVal) + 1;

                    updatedNumber = Math.min(val, max);

                    return updatedNumber;
                  });
                  
                  await setValue(updatedNumber);
                }}
              >+</Button>
            ),
          } : {})}
        />
      </Form.Item>
    </Flex>
  );
}
function Select<FieldType>(props: SelectType<FieldType>) {
  const title = props.title;
  const name = props.name;
  const required = props.required ?? true;
  const message = props.message || `Please input ${title}`;
  const options = props.options;
  const onChange = props.onChange || (() => {});
  const align = props.align || "left";
  const shown = props.shown  ?? true;
  const multiple = props.multiple ? 'multiple' : undefined;

  return (
    <div
      style={{
        display: shown ? 'inherit' : 'none',
      }}
    >
      {title &&
        <h2
          style={{
            textAlign: align as any,
          }}
        >{title}</h2>
      }
      <Form.Item<FieldType>
        name={name as any}
        rules={[{ required: required, message: message }]}
      >
        <AntdSelect
          options={options}
          onChange={onChange}
          className="input"
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
  x = x ?? 0;
  const num = Number(x) ?? 0;
  if(Number.isNaN(num) || !num) {
    return 0;
  }
  return num;
}

export { NumberInput, Select, };
