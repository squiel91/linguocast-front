import { useAuth } from "@/auth/auth.context"
import { Comment } from "@/types/types"
import { Avatar } from "@/ui/avatar.ui"
import { Button } from "@/ui/button.ui"
import { ForwardLink } from "@/ui/forward-link.ui"
import { Loader } from "@/ui/loader.ui"
import { Textarea } from "@/ui/textarea.ui"
import { readableDate } from "@/utils/date.utils"
import { urlSafe } from "@/utils/url.utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Card } from "./card.ui"

interface Props {
  resourceType: 'podcasts' | 'episodes',
  resourceId: number
}

export const ListComments = ({ resourceType, resourceId }: Props) => {
  const { isLoggedIn, openRegisterHandler } = useAuth()
  const [justAddedComments, setJustAddedComments] = useState<Comment[]>([])
  const [content, setContent] = useState<string | null>(null)
  const [savingComment, isSavingComment] = useState(false)

  const { data: serverComments, isFetching, error } = useQuery({
    queryKey: ['comments', resourceType, resourceId],
    queryFn: () => axios.get<Comment[]>(
      `/api/comments`,
      { params: { resourceType, resourceId } }
    ).then(res => res.data)
  })

  const saveCommentHandler = async () => {
    if (!isLoggedIn) return openRegisterHandler(true)
    isSavingComment(true)
    if (!content) return alert('Please write a message before sending!')
    try {
      const { data: comment } = await axios.post<Comment>(
        `/api/comments`,
        { resourceType, resourceId, content }
      )
      setJustAddedComments(c => [comment, ...c])
      setContent(null)
    } catch (error) {
      console.error(error)
      alert('There was an error while saving your comment. Please try again!')
    } finally {
      isSavingComment(false)
    }
  }

  const resource = resourceType === 'podcasts' ? 'reviews' : 'comments'

  const comments = [...justAddedComments, ...(serverComments ?? [])]
  return (
    <>
      { isFetching && <div className="p-4  pb-0"><Loader /> Loading {resource}...</div> }
      { !error && comments && (
        <>
          {comments.length > 0 &&
            (
              <ul className="flex flex-col gap-4">
                {comments.map(({ id, authorId, authorAvatar, authorName, content, createdAt }) => (
                  <li key={id}>
                    <Card>
                      {content}
                      <div className="flex gap-3 items-center mt-4">
                        <Avatar avatarUrl={authorAvatar} className="w-10 h-10" />
                        <div className="text-sm">By <Link to={`/users/${authorId}/${urlSafe(authorName)}`} className="font-bold text-primary">{authorName}</Link> on {readableDate(createdAt)}</div>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
        </>
      )}
      <Card className="mt-4 border-slate-800 border-[3px]">
        <div className="mb-2">{comments.length === 0 ? `No ${resource} yet. Be the first one to write one!` : 'Add your own review!'}</div>
        <Textarea value={content} onChange={(content) => setContent(content)} minRows={3} />
        <div className='rounded-md text-sm flex flex-col md:flex-row gap-4 md:items-center'>
          <Button
            onClick={saveCommentHandler}
            disabled={(content ?? '').length === 0}
            isLoading={savingComment}
          >
            Submit
          </Button>
          <p className='text-sm'>
            Remember to follow the <ForwardLink to="/terms" target='_blank'>code of conduct</ForwardLink>
          </p>
        </div>
      </Card>
    </>
  )
}