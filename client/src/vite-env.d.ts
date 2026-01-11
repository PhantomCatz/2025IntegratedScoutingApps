/// <reference types="vite/client" />
declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";
declare module "*.css";

import * as React from 'react';

import type * as TbaApi from './types/tbaApi';
type CustomElement = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			VITE_TBA_AUTH_KEY: string;
			VITE_EVENT_KEY: TbaApi.EventKey;
			VITE_SERVER_ADDRESS: string;
		}
	}
}

declare module "react/jsx-runtime" {
	namespace JSX {
		interface IntrinsicElements {
			[name: `${string}-${string}`]: CustomElement;
		}
	}
}
