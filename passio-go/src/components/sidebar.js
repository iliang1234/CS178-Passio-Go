import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";
import Pill from "./pill";

const SideBar = () => {
  return (
    <div>
      <Accordion className="AccordionRoot" type="multiple">
        <AccordionItem value="allston loop">
          <AccordionTrigger>
            <div className='route-info'>
              <div className='route-name'>Allston Loop</div>
              <div className='pills'>
                <Pill variant="SEC" />
                <Pill variant="Quad" />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div>Allston Schedule</div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="quad express">
          <AccordionTrigger>
            <div className='route-info'> 
              <div className='route-name'>Quad Express</div>
              <div className='pills'>
                <Pill variant="Yard" />
                <Pill variant="Quad" />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div>Quad Schedule</div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="quad sec">
          <AccordionTrigger>
            <div className='route-info'>
              <div className='route-name'>Quad SEC</div>
              <div className='pills'>
                <Pill variant="SEC" />
                <Pill variant="Yard" />
                <Pill variant="Quad" />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div>Quad SEC Schedule</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SideBar;
