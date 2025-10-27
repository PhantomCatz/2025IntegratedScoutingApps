import '../public/stylesheets/formItems.css';
import React, { useState, useRef, useEffect, } from 'react';
import { Input as AntdInput, Select as AntdSelect, Flex, Button, Radio } from 'antd';

type StringMap<T> = Extract<keyof T, string>;
type NoInfer<T> = [T][T extends any ? 0 : never];

type AlignOptions = "left" | "center" | "right";

type InputType<FieldType> = {
	title: any;
	name: StringMap<FieldType>;
	required?: boolean;
	message?: string;
	options: any[];
	onChange?: () => void;
	align?: AlignOptions;
	shown?: boolean;
	pattern?: string;
}
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
type CheckboxType<FieldType> = {
	title: any;
	name: StringMap<FieldType>;
	onChange?: () => void;
	align?: AlignOptions;
	shown?: boolean;
}


function Form(props) {
  console.log(`props=`, props);
  const onFinish = props.onFinish ?? (() => {});

  function onSubmit(event) {
    console.log(`event=`, event);
    const formValues = {};

    for(const input of event.target) {
      console.log(`input=`, input);
      formValues[input.id] = getFieldValue(input.id);
    }

    onFinish(formValues);
  }

  return (
  <form
  onSubmit={onSubmit}
  >
    {...props.children}
  </form>
  );
}
// TODO: implement required fields
function Input<FieldType>(props: InputType<FieldType>) {
	const title = props.title;
	const name = props.name;
	const form = props.form;
	const shown = props.shown ?? true;
	const required = (props.required ?? true) && shown;
	if((props.required ?? true) && !shown) {
		console.error("Required and not shown for", name)
	}
	const message = props.message ?? `Please input ${title}`;
	const onChange = props.onChange ?? (() => {});
	const align = props.align ?? "center";
	const pattern = props.pattern;

	const input = useRef(null);

	return (
		<>
			{shown &&
				<div
					className="input input__text"
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
					<input
						id={name}
						ref={input}
						type="text"
						pattern={pattern}
						onChange={onChange}
					/>
					<p
						className="message"
					>
						{message}
					</p>
				</div>
			}
		</>
	);
}
function NumberInput<FieldType>(props: NumberInputType<FieldType>) {
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
		const parsedValue = (parseInt(input.current.value) || 0) + delta;
		let newValue = 0;
		if(parsedValue > max) {
			newValue = max;
		} else if(parsedValue < min) {
			newValue = min;
		} else {
			newValue = parsedValue;
		}
		input.current.value = newValue;
		handleChange({target: {value: newValue}});
	}
	async function handleChange(e) {
		const newVal = e?.target?.value;
		console.log(`newVal=`, newVal);
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
function SelectNew<FieldType>(props: SelectType<FieldType>) {
	const title = props.title;
	const name = props.name;
	const required = props.required || true;
	const message = props.message || `Please input ${title}`;
	const options = props.options;
	const onChange = props.onChange || (() => {});
	const align = props.align || "left";
	const shown = props.shown || true;
	const multiple = props.multiple ? 'multiple' : undefined;

	return (
		<>
			{shown &&
				<div
					className="input input__select"
					style={{
						align: align,
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
					<select>
						{options.map(function(item, index) {
							return (<option value={item.value}>{item.label}</option>);
						})}
					</select>
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
				<h2
					style={{
						textAlign: align as any,
					}}
				>{title}</h2>
			}
			<AntdForm.Item<FieldType>
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
			</AntdForm.Item>
		</div>
	);
}
function Checkbox<FieldType>(props: CheckboxType<NoInfer<FieldType>>) {
	const title = props.title;
	const name = props.name;
	const onChange = props.onChange ?? (() => {});
	const align = props.align ?? "left";
	const shown = props.shown ?? true;

	const checkbox = useRef(null);

	return (
		<>
			{shown &&
				<div className="input input__checkbox">
					{title &&
						<label
							style={{
								textAlign: align,
							}}
							htmlFor={name}
						>{title}</label>
					}
					<input
						type="checkbox"
						name={name}
					/>
				</div>
			}
		</>
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
function getFieldValue(id) {
	const element = document.getElementById(id);
	const tag = element.nodeName;
  switch(tag) {
    case "SELECT":
      return
    case "INPUT":
      switch(element.type) {
        case "checkbox":
          return element.checked;
        case "number":
        case "text":
          return element.value;
          break;
        case "submit":
        default:
          return undefined;
      }
      break;
    default:
      return undefined;
  }

}

export { Input, NumberInput, Select, SelectNew, Checkbox };
export default Form;
