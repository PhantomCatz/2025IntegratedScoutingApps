import { Tabs, Input, Form, Select, Checkbox, InputNumber, Flex, Button, Radio} from 'antd';

type NumberInputType = {
  title: any;
  name: string;
  required?: boolean;
  message?: string;
  min?: number;
  max?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
  setForm: any;
};

function NumberInput<FieldType>(props: NumberInputType) {
  const title = props.title;
  const name = props.name;
  const required = props.required !== undefined ? props.required : true;
  const message = props.message || `Please input ${title}`;
  const min = props.min !== undefined ? props.min : 0;
  const max = props.max !== undefined ? props.max : Infinity;
  const onIncrease = props.onIncrease || (() => {});
  const onDecrease = props.onDecrease || (() => {});
  const setForm = props.setForm;

  return (
    <Flex vertical align='flex-start'>
      <h2>{title}</h2>
      <Form.Item<FieldType>
        name={name as any}
        rules={[{
          required: (required !== undefined) ? required : true,
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

              return form;
            });
          }}
          addonAfter={
            <Button
              className={"incrementbutton"}
              onMouseDown={() => {
                setForm((prevForm : any) => {
                  const form = {...prevForm};
                  const val = form[name] + 1;
                  if (val <= max) {
                    form[name] = val;
                  }
                  return form;
                });
                onIncrease();
              }}
            >+</Button>
          }
          addonBefore={
            <Button
              className={"decrementbutton"}
              onMouseDown={(form: any) => {
                setForm((prevForm: any) => {
                  const form = {...prevForm};
                  const val = form[name] - 1;
                  if (val >= min) {
                    form[name] = val;
                  }
                  return form;
                });
                onDecrease();
              }}
            >-</Button>
          }
        />
      </Form.Item>
    </Flex>
  );
}

export {NumberInput, };
