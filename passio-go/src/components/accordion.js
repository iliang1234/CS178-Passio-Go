import React from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import * as AccordionOriginal from '@radix-ui/react-accordion';

const Accordion = AccordionOriginal.Root;

const AccordionItem = React.forwardRef(({ className, ...props }, forwardedRef) => (
  <AccordionOriginal.Item
    className={`AccordionItem ${className}`}
    {...props}
    ref={forwardedRef}
  />
));

const AccordionTrigger = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
    <AccordionOriginal.Header className="AccordionHeader">
      <AccordionOriginal.Trigger
        className={`AccordionTrigger ${className}`}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <ChevronDownIcon className="AccordionChevron" aria-hidden />
      </AccordionOriginal.Trigger>
    </AccordionOriginal.Header>
  ));

const AccordionContent = React.forwardRef(({ children, className, ...props }, forwardedRef) => (
    <AccordionOriginal.Content
      className={`AccordionContent ${className}`}
      {...props}
      ref={forwardedRef}
    >
      <div className="AccordionContentText">{children}</div>
    </AccordionOriginal.Content>
  ));

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
