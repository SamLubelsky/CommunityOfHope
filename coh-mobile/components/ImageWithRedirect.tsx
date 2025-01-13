import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { ImageResizeMode } from 'react-native';
type Props = {
    source: string;
    resizeMode: ImageResizeMode;
    className: string;
}
export const ImageWithRedirect = ({ resizeMode, source, className }: Props) => {
  const [finalSource, setFinalSource] = useState(source);

  useEffect(() => {
    if (source.startsWith('https')) {
      // Check for redirects
      fetch(source, { method: 'HEAD' })
        .then((response) => {
          if (response.redirected) {
            setFinalSource(response.url);
            console.log("redirecting to: ", response.url);
          }
        })
        .catch((error) => {
          console.error('Error checking for redirect:', error);
        });
    }
  }, [source]);

  return <Image className={className} resizeMode={resizeMode} source={{ uri: finalSource }} />;
};