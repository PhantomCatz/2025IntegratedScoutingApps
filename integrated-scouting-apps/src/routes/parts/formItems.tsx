import '../../public/stylesheets/formItems.css';
import React, { useState, useRef, } from 'react';
import { Tabs, Input, Form, Select as AntdSelect, Checkbox, InputNumber, Flex, Button, Radio} from 'antd';

type NumberInputType = {
  title: any;
  name: string;
  required?: boolean;
  message?: string;
  min?: number;
  max?: number;
  onIncrease?: (e?: number) => void;
  onDecrease?: (e?: number) => void;
  onChange?: (e? : number) => void;
  setForm: any;
  align?: string;
  shown?: boolean;
  buttons?: boolean;
};
type SelectType = {
  title: any;
  name: string;
  required?: boolean;
  message?: string;
  options: any[];
  onChange?: () => void;
  align?: string;
  shown?: boolean;
  multiple?: boolean;
}

const NumberInput = React.memo(function <FieldType,>(props: NumberInputType) {
  const title = props.title;
  const name = props.name;
  const shown = props.shown ?? true;
  const required = (props.required ?? true) && shown;
  const message = props.message || `Please input ${title}`;
  const min = props.min ?? 0;
  const max = props.max ?? Infinity;
  const onIncrease = props.onIncrease || (() => {});
  const onDecrease = props.onDecrease || (() => {});
  const onChange = props.onChange || (() => {});
  const setForm = props.setForm;
  const align = props.align || "center";
  const buttons = props.buttons ?? true;

  const handleChange : ((event: any) => void) = (() => {
    let id : any = null;

    return function(event : any) {
      window.clearTimeout(id);

      id = setTimeout(async () => {
        const newValue : string = event.nativeEvent.target.value;
        const num : number = Number(newValue) || 0;

        if(!num || Number.isNaN(num)) {
          return;
        }

        let updatedNumber = 0;

        await setForm((prevForm : any) => {
          const form = {...prevForm};
          const prevVal : string = form[name] ?? "";

          const newVal : string = num.toString();

          const newNumber : number = Math.max(Math.min(Number(newVal), max), min);

          form[name] = newNumber.toString();

          updatedNumber = newNumber;

          return form;
        });
          
        onChange(updatedNumber);
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
              // console.log(`rule=`, rule);

              if(rule.field === "endgame_climb_time") {
                console.log(`value=`, value);
                console.log(`min=`, min);
                console.log(`max=`, max);
              }
              // console.log(`callback=`, callback);
              if(value < min) {
                console.log("asdfdasf");
                console.log(`rule.field=`, rule.field);
                return Promise.reject(`${title} must be at least ${min}`);
              }
              if(value > max) {
                console.log("lkhglkhlh");
                console.log(`rule.field=`, rule.field);
                return Promise.reject(`${title} must be at most ${max}`);
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
            //console.log(`e.keyCode=`, e.keyCode);
            const key = e.keyCode;
            if((key >= 32 && key !== 224) && ( key < "0".charCodeAt(0) || key > "9".charCodeAt(0))) {
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

                  await setForm((prevForm: any) => {
                    const form = {...prevForm};
                    const val = (form[name] ?? 0) - 1;
                    if (val >= min) {
                      form[name] = val;
                    } else {
                      form[name] = min;
                    }
                    
                    updatedNumber = val;

                    return form;
                  });
                  
                  onDecrease(updatedNumber);
                }}
              >-</Button>
            ),
            addonAfter: (
              <Button
                className={"changeButton changeButton__increment"}
                onMouseDown={async () => {
                  let updatedNumber = 0;

                  await setForm((prevForm : any) => {
                    const form = {...prevForm};
                    const val = (form[name] ?? 0) + 1;
                    if (val <= max) {
                      form[name] = val;
                    } else {
                      form[name] = max
                    }

                    updatedNumber = val;

                    return form;
                  });
                  
                  onIncrease(updatedNumber);
                }}
              >+</Button>
            ),
          } : {})}
        />
      </Form.Item>
    </Flex>
  );
});
const Select = React.memo(function <FieldType,>(props: SelectType) {
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
});

export { NumberInput, Select, };
