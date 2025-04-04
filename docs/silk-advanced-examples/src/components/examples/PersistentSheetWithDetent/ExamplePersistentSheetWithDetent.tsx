import { useContext, useState } from "react";
import { Sheet } from "@silk-hq/components";
import { PersistentSheetWithDetent } from "./PersistentSheetWithDetent";
import "./ExamplePersistentSheetWithDetent.css";

import { SheetTriggerCard } from "@/components/app/SheetTriggerCard/SheetTriggerCard";
import { SheetDismissButton } from "../_GenericComponents/SheetDismissButton/SheetDismissButton";

const ExamplePersistentSheetWithDetent = () => {
  const [rangeValue, setRangeValue] = useState("700");

  return (
    <PersistentSheetWithDetent
      presentTrigger={
        <SheetTriggerCard color="blue">
          Persistent Sheet with Detent
        </SheetTriggerCard>
      }
      retractedContent={
        <div className="ExamplePersistentSheetWithDetent-retractedRoot">
          <div className="ExamplePersistentSheetWithDetent-retractedPicture"></div>
          <div className="ExamplePersistentSheetWithDetent-retractedTextContent">
            <div className="ExamplePersistentSheetWithDetent-retractedTitle">
              Barcelona Dreams
            </div>
            <div className="ExamplePersistentSheetWithDetent-retractedSubtitle">
              Eira Voss
            </div>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="ExamplePersistentSheetWithDetent-retractedPlayButton"
          >
            <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
          </svg>
        </div>
      }
      expandedContent={
        <div className="ExamplePersistentSheetWithDetent-expandedRoot">
          <Sheet.Handle className="ExamplePersistentSheetWithDetent-expandedHandle">
            Collapse
          </Sheet.Handle>
          <Sheet.Trigger action="dismiss" asChild>
            <SheetDismissButton
              className="ExamplePersistentSheetWithDetent-expandedDismissTrigger"
              variant="simple"
            />
          </Sheet.Trigger>
          <div className="ExamplePersistentSheetWithDetent-expandedContent">
            <div className="ExamplePersistentSheetWithDetent-expandedPicture" />
            <div className="ExamplePersistentSheetWithDetent-expandedCentralContent">
              <div className="ExamplePersistentSheetWithDetent-expandedTextContent">
                <div className="ExamplePersistentSheetWithDetent-expandedTitle">
                  Barcelona Dreams
                </div>
                <div className="ExamplePersistentSheetWithDetent-expandedSubtitle">
                  Eira Voss
                </div>
              </div>
              <input
                className="ExamplePersistentSheetWithDetent-expandedRange"
                type="range"
                min="0"
                max="1000"
                value={rangeValue}
                onChange={(event) => setRangeValue(event.target.value)}
              />
            </div>
            <div className="ExamplePersistentSheetWithDetent-expandedControls">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="ExamplePersistentSheetWithDetent-expandedPreviousButton"
              >
                <path d="M7.712 4.818A1.5 1.5 0 0 1 10 6.095v2.972c.104-.13.234-.248.389-.343l6.323-3.906A1.5 1.5 0 0 1 19 6.095v7.81a1.5 1.5 0 0 1-2.288 1.276l-6.323-3.905a1.505 1.505 0 0 1-.389-.344v2.973a1.5 1.5 0 0 1-2.288 1.276l-6.323-3.905a1.5 1.5 0 0 1 0-2.552l6.323-3.906Z" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="ExamplePersistentSheetWithDetent-expandedPlayButton"
              >
                <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="ExamplePersistentSheetWithDetent-expandedNextButton"
              >
                <path d="M3.288 4.818A1.5 1.5 0 0 0 1 6.095v7.81a1.5 1.5 0 0 0 2.288 1.276l6.323-3.905c.155-.096.285-.213.389-.344v2.973a1.5 1.5 0 0 0 2.288 1.276l6.323-3.905a1.5 1.5 0 0 0 0-2.552l-6.323-3.906A1.5 1.5 0 0 0 10 6.095v2.972a1.506 1.506 0 0 0-.389-.343L3.288 4.818Z" />
              </svg>
            </div>
          </div>
        </div>
      }
    />
  );
};

export { ExamplePersistentSheetWithDetent };
