import React from 'react'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
  Button,
  Switch,
  ScrollArea,
  Avatar,
  AvatarFallback,
  Separator,
} from '@/components/ui'
import { platforms, toDisplayName } from '@/lib'
import { useForm } from 'react-hook-form'
import { useSettings } from './use-settings'

export function Settings() {
  const [settingsState, setSettingsState] = useSettings()

  const form = useForm({
    values: settingsState,
    mode: 'onChange',
  })

  React.useEffect(() => {
    const subscription = form.watch(() => {
      setSettingsState(form.getValues())
    })
    return () => subscription.unsubscribe()
  }, [form.handleSubmit, form.watch])

  return (
    <div>
      <Form {...form}>
        <form className="space-y-6">
          <div className="mb-4">
            <FormLabel className="text-base">Marketplaces</FormLabel>
            <FormDescription>
              Select the marketplaces you want to have searched below
            </FormDescription>
          </div>
          <ScrollArea className="max-h-60 full-w rounded-md border overflow-scroll mt-4">
            <div className="p-4">
              <div className="space-y-4">
                {Object.entries(platforms).map(([platformId, platform], index) => (
                  <FormField
                    key={platformId}
                    name={`platformSettings.${platformId}.enabled`}
                    render={({ field }) => (
                      <>
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 w-full">
                          <div className="flex-shrink-0">
                            <Avatar>
                              {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                              <AvatarFallback>{platform.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="space-y-1 leading-none">
                            <FormLabel>{toDisplayName(platform)}</FormLabel>
                            <FormDescription>
                              {platform.country} - {platform.currency}
                            </FormDescription>
                          </div>
                          <div className="flex-grow flex justify-end">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </div>
                        </FormItem>
                        {index < Object.keys(platforms).length - 1 && <Separator />}
                      </>
                    )}
                  />
                ))}
              </div>
            </div>
          </ScrollArea>
        </form>
      </Form>
    </div>
  )
}
