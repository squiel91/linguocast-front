import { useAuth } from "@/auth/auth.context"
import { LANGUAGES } from "@/constants/languages.constants"
import { LEVELS } from "@/constants/levels.constants"
import { Button } from "@/ui/button.ui"
import { ImageUploader } from "@/ui/image-uploader"
import { Input } from "@/ui/input.ui"
import { Loader } from "@/ui/loader.ui"
import { Select } from "@/ui/select.ui"
import { Switch } from "@/ui/switch.ui"
import { readableDate } from "@/utils/date.utils"
import { capitalize } from "@/utils/text.utils"
import { urlSafe } from "@/utils/url.utils"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { AlertCircleIcon, GlobeIcon, LogOut, RotateCcwIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

const Profile = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, logoutHandler, user: userProfile } = useAuth()

  useEffect(() => {
    if (!isLoggedIn && navigate) navigate('/explore')
  }, [isLoggedIn, navigate])

  const {
    mutate: mutateUser,
    isPending: isSaving
  } = useMutation({
    mutationFn: (formData: unknown) => axios.patch('/api/user', formData),
    onError: (error) => {
      console.error(error)
      alert('There was an error saving changes. Please try again.')
    },
    onSuccess: () => alert('Changes saved!'),
    mutationKey: ['user']
  })

  const [name, setName] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [learning, setLearning] = useState<string | null>(null)
  const [variant, setVariant] = useState<string | null>(null)
  const [level, setLevel] = useState<string | null>(null)
  const [isProfilePrivate, setIsProfilePrivate] = useState<boolean | null>(null)
  const [canOthersContact, setCanOthersContact] = useState<boolean | null>(null)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const resetValues = useCallback(() => {
    if (!userProfile) return

    setName(userProfile.name)
    setEmail(userProfile.email)
    setLearning(userProfile.learning)
    setVariant(userProfile.variant)
    setLevel(userProfile.level ?? null)
    setIsProfilePrivate(!!userProfile.isProfilePrivate)
    setCanOthersContact(!!userProfile.canOthersContact)
    setAvatar(userProfile.avatar ?? null)
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

    mutateUser({
      name,
      email,
      avatar,
      level,
      learning,
      variant,
      isProfilePrivate,
      canOthersContact
    })
  }

  const isCreators = location.pathname.startsWith('/creators')
  return (
    <div className="container">
      <div className="my-8 flex justify-between items-center gap-2">
        <h2 className="text-4xl grow">
          My Profile
        </h2>
        <Link
          to={`/users/${userProfile.id}/${urlSafe(userProfile.name)}`}
          target="_blank"
        >
          <Button variant="outline" prepend={<GlobeIcon size={16} />}>
            Public profile
          </Button>
        </Link>
        <Button
          variant='outline'
          prepend={<LogOut size={16} />}
          onClick={() => {
            logoutHandler()
            navigate('/explore')
          }}
        >
          Logout
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-2 self-start">
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
          {!isCreators && (
            <>
              <Select
                label="Studying"
                value={LANGUAGES.find(({ code, variant: v }) => code === learning && v === variant)?.id.toString() ?? null}
                disabled={isSaving}
                options={[
                  { value: null, text: '', selectable: false },
                  ...(LANGUAGES?.map(({ id, name, code }) => {
                    return ({ value: `${id}`, text: name, append: <img src={`/flags/${code + (variant ? `-${variant}` : '')}.svg`} /> })
                  }) ?? [])
                ]}
                onChange={languageId => {
                  if (!languageId) return // this case wont happen
                  const { code, variant } = LANGUAGES.find(({ id }) => id === +languageId)!
                  setLearning(code)
                  setVariant(variant)
                }}
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
            </>
          )}
          <div className="col-span-full">
            <Switch
              label="Private profile"
              checked={isProfilePrivate!!}
              onChange={setIsProfilePrivate}
            />
            <Switch
              label="Others can contact me"
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
          <div className="col-span-full italic text-sm">
            You created your account on {readableDate(userProfile.createdAt)}
          </div>
        </div>
        <ImageUploader
          image={avatar}
          uploadUrl="/api/user/avatars"
          onUploaded={setAvatar}
          cannotRemove
        />
      </div>
      <div className="flex gap-2 items-center mt-8">
        <Button onClick={saveHandler} isLoading={isSaving}>
          Save changes
        </Button>
        <Button onClick={resetValues} variant="discrete" prepend={<RotateCcwIcon size={20} />}>Discard changes</Button>
      </div>
    </div>
  )
}

export default Profile
