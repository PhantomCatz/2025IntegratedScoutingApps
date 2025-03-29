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
  console.log("upowery");
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

      id = setTimeout(() => {
        const newValue : string = event.nativeEvent.target.value;
        const num : number = Number(newValue) || 0;

        if(!num || Number.isNaN(num)) {
          return;
        }

        setForm((prevForm : any) => {
          const form = {...prevForm};
          const prevVal : string = form[name] ?? "";

          const newVal : string = num.toString();

          const newNumber : number = Math.max(Math.min(Number(newVal), max), min);
          console.log(`newNumber=`, newNumber);

          form[name] = newNumber.toString();

          onChange(newNumber);
          return form;
        });
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
        rules={[{
          required: required,
          message: message,
        }]}
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
          addonAfter: (
            <Button
              className={"changeButton changeButton__increment"}
              onMouseDown={() => {
                setForm((prevForm : any) => {
                  const form = {...prevForm};
                  const val = (form[name] ?? 0) + 1;
                  if (val <= max) {
                    form[name] = val;
                  }
                  onIncrease(val);
                  return form;
                });
              }}
            >+</Button>
          ),
          addonBefore: (
            <Button
              className={"changeButton changeButton__decrement"}
              onMouseDown={(form: any) => {
                setForm((prevForm: any) => {
                  const form = {...prevForm};
                  const val = (form[name] ?? 0) - 1;
                  if (val >= min) {
                    form[name] = val;
                  }
                  onDecrease(val);
                  return form;
                });
              }}
            >-</Button>
          )
          } : {})}
        />
      </Form.Item>
    </Flex>
  );
}, function(a : any, b : any) {
  //console.log(`a=`, a);
  //console.log(`b=`, b);

  return true;
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
