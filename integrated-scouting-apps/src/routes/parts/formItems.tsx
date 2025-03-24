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

function NumberInput<FieldType>(props: NumberInputType) {
  const title = props.title;
  const name = props.name;
  const shown = props.shown ?? true;
  const required = (props.required !== undefined ? props.required : true) && shown;
  const message = props.message || `Please input ${title}`;
  const min = props.min !== undefined ? props.min : 0;
  const max = props.max !== undefined ? props.max : Infinity;
  const onIncrease = props.onIncrease || (() => {});
  const onDecrease = props.onDecrease || (() => {});
  const onChange = props.onChange || (() => {});
  const setForm = props.setForm;
  const align = props.align || "center";
  const buttons = props.buttons ?? true;

  return (
    <Flex
      vertical
      align='flex-start'
      style={{
        display: shown ? 'inherit' : 'none',
      }}
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
          message: message
        }]}
      >
        <InputNumber
          id={name}
          type={"number"}
          pattern={"\d*"}
          min={min}
          max={max}
          onWheel={(e) => (e.target as HTMLElement).blur()}
          className={"input"}
          onChange={(event) => {
            setForm((prevForm : any) => {
              const form = {...prevForm};
              const prevVal = form[name];
              const val = Number(event);

              const number = Math.min(Math.max(val, min), max);

              form[name] = number;

              onChange(val);
              return form;
            });
          }}
          {...(buttons ? {
          addonAfter: (
            <Button
              className={"incrementbutton"}
              onMouseDown={() => {
                setForm((prevForm : any) => {
                  const form = {...prevForm};
                  const val = form[name] + 1;
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
              className={"decrementbutton"}
              onMouseDown={(form: any) => {
                setForm((prevForm: any) => {
                  const form = {...prevForm};
                  const val = form[name] - 1;
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
}
function Select<FieldType>(props: SelectType) {
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

export { NumberInput, Select, };
