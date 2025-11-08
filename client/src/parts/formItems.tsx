import '../public/stylesheets/formItems.css';
import React, { useState, useRef, useEffect, } from 'react';

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
	const onFinish = props.onFinish ?? (() => {});

	function onSubmit(event) {
		event.preventDefault();
		const formValues = {};

		for(const input of event.target) {
			if(!input.id) {
				continue;
			}
			formValues[input.id] = getFieldValue(input.id);
		}

		onFinish(formValues);
	}

	const children = props.children;

	return (
		<form
			onSubmit={onSubmit}
		>
			{children}
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
						name={name}
						ref={input}
						type="text"
						pattern={pattern}
						onChange={onChange}
						required={required}
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
// TODO: check out oninvalid for error message
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
	const defaultValue = props.defaultValue ?? min;

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
							name={name}
							ref={input}
							type="number"
							min={min}
							max={max}
							onChange={handleChange}
							required={required}
							defaultValue={defaultValue}
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
function Select<FieldType>(props: SelectType<FieldType>) {
	const title = props.title;
	const name = props.name;
	const required = props.required ?? true;
	const message = props.message ?? `Please input ${title}`;
	const options = props.options;
	const onChange = props.onChange ?? (() => {});
	const align = props.align ?? "left";
	const shown = props.shown ?? true;
	const multiple = props.multiple;
	const defaultValue = multiple ?
		props.defaultValue ? [props.defaultValue] : [] :
		props.defaultValue ?? "";

	const optionElements = options.map(function(item, index) {
		return (
			<option
				value={item.value}
				key={index + 1}
			>
				{item.label}
			</option>
		);
	});
	optionElements.unshift(
		<option
			value=""
			key={0}
			disabled
			hidden
		>
		</option>
	);

	function handleOnChange(event) {
		onChange(event.target.value);
	}

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
					<select
						id={name}
						name={name}
						defaultValue={defaultValue}
						required={required}
						multiple={multiple}
						onChange={handleOnChange}
						size={multiple ? options.length : undefined}
					>
						{optionElements}
					</select>
				</div>
			}
		</>
	);
}
function Checkbox<FieldType>(props: CheckboxType<NoInfer<FieldType>>) {
	const title = props.title;
	const name = props.name;
	const onChange = props.onChange ?? (() => {});
	const align = props.align ?? "left";
	const shown = props.shown ?? true;

	const checkbox = useRef(null);

	function handleOnChange(event) {
		onChange(event.target.value);
	}

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
						id={name}
						name={name}
						type="checkbox"
						onChange={handleOnChange}
					/>
				</div>
			}
		</>
	);
}
function TextArea(props) {
	const title = props.title;
	const name = props.name;
	const onChange = props.onChange ?? (() => {});
	const align = props.align ?? "left";
	const shown = props.shown ?? true;
	const defaultValue = props.defaultValue;
	const required = props.required ?? true;

	const textbox = useRef(null);

	return (
		<>
			{shown &&
				<div className="input input__textarea">
					{title &&
						<label
							style={{
								textAlign: align,
							}}
							htmlFor={name}
						>{title}</label>
					}
					<textarea
						id={name}
						name={name}
						ref={textbox}
						defaultValue={defaultValue}
						required={required}
					/>
				</div>
			}
		</>
	);
}


function getFieldValue(id) {
	const element = document.getElementById(id);
	const tag = element?.nodeName;
	switch(tag) {
		case "SELECT":
			if(element.multiple) {
				const options = [];
				for(const option of element.selectedOptions) {
					options.push(option);
				}
				return options;
			} else {
				return element.value;
			}
			break;
		case "TEXTAREA":
			return element.value;
			break;
		case "INPUT":
			switch(element.type) {
				case "checkbox":
					return element.checked;
					break;
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
function setFieldValue(id, newValue) {
	const element = document.getElementById(id);

	if(!element) {
		return;
	}

	const tag = element.nodeName;

	switch(tag) {
		case "SELECT":
			if(element.multiple) {
				for (var i = 0; i < element.options.length; i++) {
					element.options[i].selected = newValue.indexOf(element.options[i].value) >= 0;
				}
			} else {
				element.value = newValue;
			}
			break;
		case "TEXTAREA":
			element.value = newValue;
			break;
		case "INPUT":
			switch(element.type) {
				case "checkbox":
					element.checked = newValue;
					break;
				case "number":
				case "text":
					element.value = newValue;
					break;
			}
			break;
	}
}
function setFormValues(values) {
	for(const [k, v] of Object.entries(values)) {
		setFieldValue(k, v);
	}
}
function resetFields() {
	const form = document.querySelector("form");

	if(!form) {
		console.error(`No form: form=`, form);
		return;
	}

	form.reset();
}

export { Input, NumberInput, Select, Checkbox, TextArea };
export { getFieldValue, setFieldValue, setFormValues, resetFields };
export default Form;
