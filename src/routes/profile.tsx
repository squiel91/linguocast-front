import { useAuth } from "@/auth/auth.context"
import { LEVELS } from "@/constants/levels.constants"
import { Language } from "@/types/types"
import { Breadcrumb } from "@/ui/breadcrumb.ui"
import { Button } from "@/ui/button.ui"
import { ForwardLink } from "@/ui/forward-link.ui"
import { ImageUploader } from "@/ui/image-uploader"
import { Input } from "@/ui/input.ui"
import { Loader } from "@/ui/loader.ui"
import { Select } from "@/ui/select.ui"
import { Switch } from "@/ui/switch.ui"
import { readableDate } from "@/utils/date.utils"
import { capitalize } from "@/utils/text.utils"
import { urlSafe } from "@/utils/url.utils"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { AlertCircleIcon, CrownIcon, GlobeIcon, LogOut, RotateCcwIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Profile = () => {
  const navigate = useNavigate()
  const { isLoggedIn, logoutHandler, user: userProfile } = useAuth()

  useEffect(() => {
    if (!isLoggedIn && navigate) navigate('/explore')
  }, [isLoggedIn, navigate])


  const { data: languages, isFetching: isFetchingLanguages } = useQuery({
    queryKey: ['languages'],
    queryFn: () => axios.get<Language[]>('/api/languages').then(res => res.data)
  })

  const {
    mutate: mutateUser,
    isPending: isSaving
  } = useMutation({
    mutationFn: (formData: FormData) => axios.patch('/api/user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
    onError: (error) => {
      console.error(error)
      alert('There was an error saving changes. Please try again.')
    },
    onSuccess: () => alert('Changes saved!'),
    mutationKey: ['user']
  })

  const [name, setName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [savedAvatarUrl, setSavedAvatarUrl] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [learning, setLearning] = useState<string | null>(null)
  const [level, setLevel] = useState<string | null>(null)
  const [isProfilePrivate, setIsProfilePrivate] = useState<boolean | null>(null)
  const [canOthersContact, setCanOthersContact] = useState<boolean | null>(null)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const resetValues = useCallback(() => {
    if (!userProfile) return

    setName(userProfile.name)
    setEmail(userProfile.email)
    setLearning(userProfile.learning)
    setLevel(userProfile.level ?? null)
    setIsProfilePrivate(userProfile.isProfilePrivate)
    setCanOthersContact(userProfile.canOthersContact)
    setSavedAvatarUrl(userProfile.avatar ?? null)
  }, [userProfile])

  useEffect(() => {
    resetValues()
  }, [userProfile, resetValues])

  if (!userProfile) return <Loader />

  const saveHandler = () => {
    setErrorMessage(null)
    if (!name) return setErrorMessage('The name is required.')
    if (!email) return setErrorMessage('The email is required.')
    if (!learning) return setErrorMessage('The language is required.')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    if (avatarFile) formData.append('avatarFile', avatarFile)
    if (level) formData.append('level', level)
    formData.append('learning', learning)
    formData.append('isProfilePrivate', JSON.stringify(isProfilePrivate))
    formData.append('canOthersContact', JSON.stringify(
      isProfilePrivate ? false : canOthersContact!!
    ))

    mutateUser(formData)
  }

  return (
    <>
      <Breadcrumb current="Profile" />
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-4xl font-bold">
          Profile
        </h1>
        <ForwardLink
          to={`/users/${userProfile.id}/${urlSafe(userProfile.name)}`}
          target="_blank"
        >
          <div className="flex items-center gap-2">
            <GlobeIcon size={16} />
            Public profile
          </div>
        </ForwardLink>
      </div>
      <ImageUploader
        image={avatarFile
          ? avatarFile
          : savedAvatarUrl
            ? `/dynamics/users/avatars/${savedAvatarUrl}`
            : null}
        className="w-48"
        onChange={(image) => {
          setSavedAvatarUrl(null)
          setAvatarFile(image)
        }}
        cannotRemove
        rounded
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Name"
          value={name}
          details="This name will be public."
          onChange={setName}
          disabled={isSaving}
        />
        <Input
          label="Email"
          value={email}
          details="Never shared. We only use it to send you important notifications."
          onChange={setEmail}
          disabled={isSaving
          }
        />
        <Select
          label="Studying"
          value={learning}
          disabled={isFetchingLanguages || isSaving}
          options={[
            { value: null, text: '', selectable: false },
            ...(languages?.map(({ name }) => {
              return ({ value: name, text: capitalize(name), append: <img src={`/flags/${name}.svg`} /> })
            }) ?? [])
          ]}
          onChange={languageCode => setLearning(languageCode)}
        />
        <Select
          label="Current Level"
          value={level}
          disabled={isSaving}
          options={[
            { value: null, text: '', selectable: false },
            ...(LEVELS.map(level => (
              {value: level, text: capitalize(level) }
            )))
          ]}
          onChange={level => setLevel(level)}
        />
        <div className="col-span-full">
          <Switch
            label="Private profile"
            checked={isProfilePrivate!!}
            onChange={setIsProfilePrivate}
          />
          <Switch
            label="Other can contact me"
            checked={isProfilePrivate ? false : canOthersContact!!}
            onChange={setCanOthersContact}
          />
        </div>
        {errorMessage && (
          <div className='rounded-md flex gap-4 items-start bg-red-100 text-red-600 p-4 col-span-full'>
            <AlertCircleIcon strokeWidth={1} />
            {errorMessage}
          </div>
        )}
        <div className="col-span-full flex gap-2">
          <Button onClick={saveHandler} isLoading={isSaving}>
            Save changes
          </Button>
          <Button onClick={resetValues} variant="discrete" prepend={<RotateCcwIcon size={20} />}>Discard changes</Button>
        </div>
        <div className="col-span-full">
          You created your account on {readableDate(userProfile.createdAt)}
        </div>
        <div className="col-span-full">
          {userProfile.isPremium
            ? 'You are a premium user.'
            : (
              <Button prepend={<CrownIcon size={16} />}>
                <Link to="/premium">
                  Try Premium!
                </Link>
              </Button>
            )
          }
        </div>
        <div className="col-span-full">
          <Button
            variant='discrete'
            prepend={<LogOut size={16} />}
            onClick={() => {
              logoutHandler()
              navigate('/explore')
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </>
  )
}

export default Profile
