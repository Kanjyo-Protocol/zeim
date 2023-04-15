import { Editable, EditableInput, EditablePreview } from '@chakra-ui/editable'
import { useCallback, useEffect, useState } from 'react'

type EditableText = {
  index: number
  csvKey: string
  handleOnSubmit: (i: number, object: any) => void
  defaultValue?: string
}
export const EditableText: React.FC<EditableText> = ({
  index,
  csvKey,
  handleOnSubmit,
  defaultValue
}) => {
  const [val, setVal] = useState<string | undefined>()
  useEffect(() => {
    if (defaultValue) {
      setVal(defaultValue)
    }
  }, [defaultValue])

  const handleOnSubmitEditable = useCallback(
    (value: string) => {
      setVal(value)
      handleOnSubmit(index, { [csvKey]: value })
    },
    [handleOnSubmit, index, csvKey]
  )

  return (
    <Editable
      value={val}
      onChange={(value) => setVal(value)}
      onSubmit={(value) => handleOnSubmitEditable(value)}
    >
      <EditablePreview />
      <EditableInput />
    </Editable>
  )
}
