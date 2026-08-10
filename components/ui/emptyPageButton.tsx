import { ArrowUpRightIcon, Plus } from "lucide-react"

import { Button } from "../../components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../components/ui/empty"

// export function EmptyPage({Title,Description, buttonType}) {
//   return (
//     <Empty>
//       <EmptyHeader>
        
//           <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
//             <Plus className="w-5 h-5 text-grey-300" />
//           </div>
       
//         <EmptyTitle>{Title}</EmptyTitle>
//         <EmptyDescription>
//          {Description}
//         </EmptyDescription>
//       </EmptyHeader>
//       <EmptyContent className="flex-row justify-center gap-2">
//         <Button className="bg-[#05563E] hover:bg-green-700 text-white font-semibold">
//           <Plus className="mr-2 h-4 w-4" />
//           Add New Product
//         </Button>

//       </EmptyContent>
//     </Empty>
//   )
// }

type EmptyPageProps = {
  Title: string
  Description: string
  buttonType?: 'add' | 'no button' // Optional prop to control button rendering
}

export function EmptyPage({ Title, Description, buttonType = 'add' } : EmptyPageProps) {
  return (
    <Empty>
      <EmptyHeader>
        {/* Conditional rendering for the icon */}
        {buttonType === 'no button' ? (
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs bg-[#262626] text-white">
            <span className="text-xs font-semibold text-white">—</span>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <Plus className="w-5 h-5 text-grey-300" />
          </div>
        )}

        <EmptyTitle>{Title}</EmptyTitle>
        <EmptyDescription>{Description}</EmptyDescription>
      </EmptyHeader>

      {/* Only render the button if buttonType is not 'no button' */}
      {buttonType !== 'no button' && (
        <EmptyContent className="flex-row justify-center gap-2">
          <Button className="bg-[#05563E] hover:bg-green-700 text-white font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
}


export default EmptyPage;