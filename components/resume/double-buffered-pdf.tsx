'use client';

import { ReactElement, cloneElement, useEffect, useRef, useState } from 'react';

type BufferElement = ReactElement | null;

type Props = {
  render: (onSuccess: () => void) => BufferElement;
};

export function DoubleBufferedPDF({ render }: Props) {
  const backElementRef = useRef<BufferElement>(null);
  const frontElementRef = useRef<BufferElement>(null);
  const [elements, setElements] = useState<null | Array<BufferElement>>(null);
  const lastKeyRef = useRef(0);

  // Called when the new PDF is fully loaded
  const onRenderSuccess = () => {
    console.log('DoubleBuffered: onRenderSuccess called, swapping buffers');
    frontElementRef.current = backElementRef.current
      ? cloneElement(backElementRef.current, {
          'data-ready': 'true',
        })
      : null;

    setElements([frontElementRef.current]);
  };

  useEffect(() => {
    console.log('DoubleBuffered: render function changed, creating new element');
    const renderedElement = render(onRenderSuccess);

    if (renderedElement) {
      const backElement = cloneElement(renderedElement, {
        key: lastKeyRef.current,
        'data-ready': 'false',
      });
      backElementRef.current = backElement;
      lastKeyRef.current++;
      console.log('DoubleBuffered: Showing both elements (front + back)');
      // Show both: front (visible) and back (hidden, loading)
      setElements([backElementRef.current, frontElementRef.current]);
    } else {
      backElementRef.current = null;
      onRenderSuccess();
    }
  }, [render]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {elements}
    </div>
  );
}
