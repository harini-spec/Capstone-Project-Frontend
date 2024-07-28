import { useState, useEffect } from 'react';
import { colors } from '../../Data/ColorData.js';
  
export const useColor = () => {
      const [Color, setColor] = useState({});
  
      useEffect(() => {
        const GetColor = () => {
            var keys = Object.keys(colors);
            setColor(colors[keys[ keys.length * Math.random() << 0]]);
        }
  
        GetColor();
      }, []);
  
      return [Color, setColor];
  };