import { useAuth } from "@/auth/auth.context"
import { LANGUAGES } from "@/constants/languages.constants"
import { LEVELS } from "@/constants/levels.constants"
import { Button } from "@/ui/button.ui"
import { Dropdown } from "@/ui/dropdown.ui"
import { ImageUploader } from "@/ui/image-uploader"
import { Input } from "@/ui/input.ui"
import { Loader } from "@/ui/loader.ui"
import { Select } from "@/ui/select.ui"
import { Switch } from "@/ui/switch.ui"
import { useTitle } from "@/utils/document.utils"
import { capitalize } from "@/utils/text.utils"
import { urlSafe } from "@/utils/url.utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { AlertCircleIcon, EllipsisVertical, GlobeIcon, LogOut, RotateCcwIcon, SaveIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const Profile = () => {
  const queryClient = useQueryClient()

  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, logoutHandler: authLogoutHandler, user: userProfile } = useAuth()

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      alert('Changes saved!')
    },
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

  useTitle('My profile')

  if (!userProfile) return (
    <div className="flex items-center justify-center p-24">
      <Loader big />
    </div>
  )

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

  const logoutHandler = () => {
    authLogoutHandler()
    navigate('/explore')
  }

  const isCreators = location.pathname.startsWith('/creators')
  return (
    <div className="container">
      <div className="my-8 flex justify-between items-center gap-2">
        <h2 className="text-4xl grow">
          My Profile
        </h2>
        <Dropdown
          unformated
          items={[
            {
              title: 'Public profile',
              to: `/users/${userProfile.id}/${urlSafe(userProfile.name)}`,
              target: '_blank',
              icon: <GlobeIcon size={16} />,
              unformated: true
            },
            {
              title: 'Logout',
              onClick: logoutHandler,
              icon: <LogOut size={16} />,
              unformated: true
            }
          ]}
        >
          <EllipsisVertical />
        </Dropdown>
      </div>
      <div className="flex flex-col-reverse md:grid md:grid-cols-3 gap-8">
        <div className="grid col-span-full md:col-span-2 grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 self-start">
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
                value={learning ? learning + (variant ? `/${variant}` : '') : null}
                disabled={isSaving}
                options={[
                  { value: null, text: '', selectable: false },
                  ...LANGUAGES.flatMap(
                    ({ code, name, variants }) => {
                      if (variants && variants.length > 0) {
                        return variants.map(variant => ({
                          value: code + '/' + variant,
                          text: `${name} (${capitalize(variant)})`,
                          append: <img src={`/flags/${code}-${variant}.svg`} />
                        }))
                      }
                      return ({
                        value: code,
                        text: name,
                        append: <img src={`/flags/${code}.svg`} />
                      })
                    }
                  )
                ]}
                onChange={codePossiblyWithVariant => {
                  if (!codePossiblyWithVariant) return // this case wont happen
                  const [code, variant] = codePossiblyWithVariant.split('/')
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
        </div>
        <ImageUploader
          image={avatar}
          uploadUrl="/api/user/avatars"
          onUploaded={setAvatar}
          cannotRemove
        />
      </div>
      <div className="flex flex-col md:flex-row gap-x-2 gap-y-2 items-center mt-8">
        <Button onClick={saveHandler} prepend={<SaveIcon size={20} />} isLoading={isSaving} wFullInMobile>
          Save changes
        </Button>
        <Button onClick={resetValues} variant="discrete" wFullInMobile prepend={<RotateCcwIcon size={20} />}>Discard changes</Button>
      </div>
    </div>
  )
}

export default Profile
