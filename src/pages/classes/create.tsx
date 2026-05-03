import { CreateView } from '@/components/refine-ui/views/create-view'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { Button } from '@/components/ui/button'
import { useBack } from '@refinedev/core'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {zodResolver} from '@hookform/resolvers/zod'
import {useForm} from 'react-hook-form'
import { classSchema } from '@/lib/schema'
import z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,    
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import UploadWidget from '@/components/upload-widget'

const teachers = [
    { id: 1, number: 101 },
    { id: 2, number: 102 },
    { id: 3, number: 103 },
]

const subjects = [
    { id: 1, name: 'Mathematics', code: 'MATH' },
    { id: 2, name: 'Biology', code: 'BIOL' },
    { id: 3, name: 'Computer Science', code: 'COMP' },
]

const ClassesCreate = () => {
    const back = useBack();
    const form = useForm<z.infer<typeof classSchema>>({
        resolver: zodResolver(classSchema),
        defaultValues:{
            status:'active',
        }
    });
    const {handleSubmit,formState:{isSubmitting,errors},control} = form;
    const onSubmit = (values: z.infer<typeof classSchema>) => {
        try {
            console.log("Form values:", values);
        } catch (e) {
            console.log("Error creating new Classes",e);
            
        }
    };
    const bannerPublicId = form.watch("bannerCldPubId");
    const setBannerImage = (file:any, field:any)=>{
        if(file){
            field.onChange(file.url);
            form.setValue("bannerCldPubId", file.publicId,{
                shouldDirty:true,
                shouldValidate:true,
            });
        }else{
            field.onChange("");
            form.setValue("bannerCldPubId", "",{
                shouldDirty:true,
                shouldValidate:true,
            });
        }
    }
  return (
    <CreateView className='class-view'>
        <Breadcrumb/>
        <h1 className='page-title'>Create a class</h1>
        <div className="intro-row">
            <p>Provide the required information below to add a class</p>
            <Button onClick={back}>Go Back</Button>
        </div>
        <Separator />
        <div className='my-4 flex items-center'>
            <Card className='class-form-card'>
                <CardHeader className='relative z-10'>
                    <CardTitle className='text-2xl pb-0 font-bold'>Fill out the form </CardTitle>

                </CardHeader>
                <Separator />
                <CardContent className='mt-7'>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-6'>
                           <FormField 
                           control={control}
                           name = "bannerUrl"
                           render ={({field})=>(
                            <FormItem>
                                <FormLabel>Banner Image <span className='text-orange-600'>*
                                    </span> 
                                </FormLabel>
                                <FormControl>
                                    <UploadWidget 
                                value={field.value ? {url:field.value,publicId:bannerPublicId} : null}
                                onChange={(file:any)=>setBannerImage(file, field) }
                                      />
                                </FormControl>
                                <FormMessage/>
                                {errors.bannerCldPubId && !errors.bannerUrl&&(
                                    <p className="text-destructive text-sm">
                                        {errors?.bannerCldPubId?.message}
                                    </p>
                                )}
                            </FormItem>
                           )}
                           />


                            <FormField control={control} 
                            name="name" 
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Class Name <span className='text-orange-600'>*
                                    </span> 
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Introduction to Biology - Section A" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className='grid sm:grid-cols-2 gap-2'>
                                 <FormField control={control} 
                            name="subjectId" 
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Subject <span className='text-orange-600'>*
                                    </span> 
                                    </FormLabel>
                                        <Select onValueChange={(value)=>field.onChange(Number(value))} value={field?.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a subject" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {subjects.map((subject) => (
                                            <SelectItem key={subject.id} value={subject.id.toString()}>
                                                {subject.name} ({subject.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                        </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField
                                control={control}
                                name="teacherId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Teacher <span className='text-orange-600'>*</span>
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a teacher" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {teachers.map((teacher) => (
                                                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                                        Teacher {teacher.number}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                                <FormField
                                    control={control}
                                    name="capacity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Capacity <span className='text-orange-600'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    placeholder="30"
                                                    {...field}
                                                    onChange={(event) => field.onChange(Number(event.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            <FormField
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Status <span className='text-orange-600'>*</span>
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            </div>
                            <FormField
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Description <span className='text-orange-600'>*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Write a short summary for this class"
                                                className="min-h-24"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Create Class</Button>
                        </form>

                    </Form>
                </CardContent>
            </Card>
        </div>

    </CreateView>
  )
}

export default ClassesCreate