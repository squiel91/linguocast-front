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

interface Props {
  podcastId: number,
} 

export const CommentViewPodcasts = ({ podcastId }: Props) => {
  const { isLoggedIn, openRegisterHandler } = useAuth()
  const [justAddedComments, setJustAddedComments] = useState<Comment[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [savingComment, isSavingComment] = useState(false)

  const { data: serverComments, isFetching, error } = useQuery({
    queryKey: ['podcasts', podcastId, 'comments'],
    queryFn: () => axios.get<Comment[]>(`/api/podcasts/${podcastId}/comments`).then(res => res.data)
  })

  const saveCommentHandler = async () => {
    if (!isLoggedIn) return openRegisterHandler(true)
    isSavingComment(true)
    if (!message) return alert('Please write a message before sending!')
    try {
      const { data: comment } = await axios.post<Comment>(
        `/api/podcasts/${podcastId}/comments`,
        { podcastId, message }
      )
      setJustAddedComments(c => [comment, ...c])
      setMessage(null)
    } catch (error) {
      console.error(error)
      alert('There was an error while saving your comment. Please try again!')
    } finally {
      isSavingComment(false)
    }
  } 

  const comments = [...justAddedComments, ...(serverComments ?? [])]
  return (
    <div>
      { isFetching && <Loader /> }
      { !error && comments && (
        <>
          {comments.length === 0
            ? <p>No reviews yet. Be the first one to write one!</p>
            : (
              <ul className="flex flex-col">
                {comments.map(({ id, authorId, authorAvatar, authorName, message, createdAt }) => (
                  <li key={id}>
                    <div className="py-4 border-b-2">
                      {message}
                      <div className="flex gap-3 items-center mt-4">
                        <Avatar avatarUrl={authorAvatar} className="w-10 h-10" />
                        <div className="text-sm">By <Link to={`/users/${authorId}/${urlSafe(authorName)}`} className="font-bold text-primary">{authorName}</Link> on {readableDate(createdAt)}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
        </>
      )}
      <div className="mt-4">
        <Textarea value={message} onChange={(message) => setMessage(message)} minRows={3} />
        <div className='rounded-md text-sm flex flex-col md:flex-row gap-4 md:items-center'>
          <Button
            onClick={saveCommentHandler}
            disabled={(message ?? '').length === 0}
            isLoading={savingComment}
          >
            Post review
          </Button>
          <p className='text-sm'>
            Remember to follow the <ForwardLink to="/contributions" target='_blank'>contributions guide</ForwardLink>
          </p>
        </div>
      </div>
    </div>
  )
}