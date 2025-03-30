import { Sheet } from "@silk-hq/components";
import "./BottomSheet.css";

const BottomSheet = () => (
  <Sheet.Root license="commercial">
    <Sheet.Trigger>bottomsheet open</Sheet.Trigger>
    <Sheet.Portal>
      <Sheet.View className="BottomSheet-view" nativeEdgeSwipePrevention={true}>
        <Sheet.Backdrop themeColorDimming={false} />
        <Sheet.Content className="BottomSheet-content">
          <Sheet.BleedingBackground className="BottomSheet-bleedingBackground" />
          <p>Some content</p>

          <p>Actually a ton of content</p>
        </Sheet.Content>
      </Sheet.View>
    </Sheet.Portal>
  </Sheet.Root>
);

export { BottomSheet }; 