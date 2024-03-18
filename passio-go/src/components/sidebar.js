import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";
import Checkbox from "./checkbox";
import { MagicWand } from "@phosphor-icons/react";
import Pill from "./pill";
import Schedule from "../schedule";

const SideBar = () => {
  return (
    <div>
      <Accordion className="AccordionRoot" type="multiple">
        <AccordionItem value="allston loop">
          <div className='AccordionInfo'>
            <div className='route-main'>
              <Checkbox id="allston loop" checked/>
              <div className='route'>
                <div className='route-info'>
                  <div className='route-name'>Allston Loop</div>
                  <MagicWand />
                </div>
                <div className='pills'>
                  <Pill variant="SEC" />
                  <Pill variant="Quad" />
                </div>
              </div>
            </div>
            <AccordionTrigger className='first-level'/>
          </div>
          <AccordionContent>
            <Schedule routeId='778'/>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="quad express">
          <div className='AccordionInfo'>
            <div className='route-main'>
              <Checkbox id="quad express" checked/>
              <div className='route'>
                <div className='route-info'>
                  <div className='route-name'>Quad Express</div>
                  <MagicWand />
                </div>
                <div className='pills'>
                  <Pill variant="Yard" />
                  <Pill variant="Quad" />
                </div>
              </div>
            </div>
            <AccordionTrigger className='first-level'/>
          </div>
          <AccordionContent>
            <Schedule routeId='790'/>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="quad sec">
          <div className='AccordionInfo'>
            <div className='route-main'>
              <Checkbox id="quad sec" checked/>
              <div className='route'>
                <div className='route-info'>
                  <div className='route-name'>Quad SEC</div>
                  <MagicWand />
                </div>
                <div className='pills'>
                  <Pill variant="SEC" />
                  <Pill variant="Yard" />
                  <Pill variant="Quad" />
                </div>
              </div>
            </div>
            <AccordionTrigger className='first-level'/>
          </div>
          <AccordionContent>
            <Schedule routeId='2235'/>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="1636'er" disabled>
          <div className='AccordionInfo'>
            <div className='route-main'>
              <Checkbox id="1636'er" disabled/>
              <div className='route'>
                <div className='route-info'>
                  <div className='route-name'>1636'er</div>
                  <MagicWand />
                </div>
                <div className='pills'>
                  <Pill variant="Yard" />
                  <Pill variant="Quad" />
                </div>
              </div>
            </div>
            <AccordionTrigger className='first-level'/>
          </div>
          <AccordionContent />
        </AccordionItem>
        <AccordionItem value="crimson cruiser" disabled>
          <div className='AccordionInfo'>
            <div className='route-main'>
              <Checkbox id="crimson cruiser" disabled/>
              <div className='route'>
                <div className='route-info'>
                  <div className='route-name'>Crimson Cruiser</div>
                  <MagicWand />
                </div>
                <div className='pills'>
                  <Pill variant="Yard" />
                  <Pill variant="Quad" />
                </div>
              </div>
            </div>
            <AccordionTrigger className='first-level'/>
          </div>
          <AccordionContent />
        </AccordionItem>
        <AccordionItem value="mather express" disabled>
          <div className='AccordionInfo'>
            <div className='route-main'>
              <Checkbox id="mather express" disabled/>
              <div className='route'>
                <div className='route-info'>
                  <div className='route-name'>Mather Express</div>
                  <MagicWand />
                </div>
                <div className='pills'>
                  <Pill variant="Yard" />
                </div>
              </div>
            </div>
            <AccordionTrigger className='first-level'/>
          </div>
          <AccordionContent />
        </AccordionItem>
        <AccordionItem value="quad yard express" disabled>
          <div className='AccordionInfo'>
            <div className='route-main'>
              <Checkbox id="quad yard express" disabled/>
              <div className='route'>
                <div className='route-info'>
                  <div className='route-name'>Quad Yard Express</div>
                  <MagicWand />
                </div>
                <div className='pills'>
                  <Pill variant="Yard" />
                  <Pill variant="Quad" />
                </div>
              </div>
            </div>
            <AccordionTrigger className='first-level'/>
          </div>
          <AccordionContent />
        </AccordionItem>
        <AccordionItem value="sec express" disabled>
          <div className='AccordionInfo'>
            <div className='route-main'>
              <Checkbox id="sec express" disabled/>
              <div className='route'>
                <div className='route-info'>
                  <div className='route-name'>SEC Express</div>
                  <MagicWand />
                </div>
                <div className='pills'>
                  <Pill variant="SEC" />
                  <Pill variant="Yard" />
                </div>
              </div>
            </div>
            <AccordionTrigger className='first-level'/>
          </div>
          <AccordionContent />
        </AccordionItem>
        <AccordionItem value="overnight" disabled>
          <div className='AccordionInfo'>
            <div className='route-main'>
              <Checkbox id="overnight" disabled/>
              <div className='route'>
                <div className='route-info'>
                  <div className='route-name'>Overnight</div>
                  <MagicWand />
                </div>
                <div className='pills'>
                  <Pill variant="SEC" />
                  <Pill variant="Yard" />
                </div>
              </div>
            </div>
            <AccordionTrigger className='first-level'/>
          </div>
          <AccordionContent />
        </AccordionItem>
        <AccordionItem value="quad stadium express" disabled>
          <div className='AccordionInfo'>
            <div className='route-main'>
              <Checkbox id="quad stadium express" disabled/>
              <div className='route'>
                <div className='route-info'>
                  <div className='route-name'>Quad Stadium Express</div>
                  <MagicWand />
                </div>
                <div className='pills'>
                  <Pill variant="Yard" />
                  <Pill variant="Quad" />
                </div>
              </div>
            </div>
            <AccordionTrigger className='first-level'/>
          </div>
          <AccordionContent />
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SideBar;
