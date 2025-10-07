import '../public/stylesheets/settings.css';
import { useEffect, useState} from 'react';
import Header from '../parts/header';
import { NumberInput } from '../parts/formItems';
import {useLocalStorage, } from 'react-use';

const DEFAULT_SETTINGS = {
  backgroundColor: '#ffffff',
  fontColor: '#000000',
} as const;

function Settings(props: any) {
  const [background, setBackground] = useLocalStorage<any>('background', DEFAULT_SETTINGS.backgroundColor);
  const [fontColor, setFontColor] = useLocalStorage<any>('fontColor', DEFAULT_SETTINGS.fontColor);

  return (
    <>
      <Header name={"Settings"} back="#/" />

    </>
  );
}

export default Settings;
