import { useAuth } from "@/auth/auth.context"
import { Comment } from "@/types/types"
import { Button } from "@/ui/button.ui"
import { Loader } from "@/ui/loader.ui"
import { Textarea } from "@/ui/textarea.ui"
import { readableDate } from "@/utils/date.utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useState } from "react"

interface Props {
  podcastId: number,
} 

export const CommentViewPodcasts = ({ podcastId }: Props) => {
  const { isLoggedIn, openRegisterHandler } = useAuth()
  const [justAddedComments, setJustAddedComments] = useState<Comment[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [savingComment, isSavingComment] = useState(false)

  const { data: serverComments, isFetching, error } = useQuery({
    queryKey: ['comments', podcastId, 'comments'],
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
      <div className="pb-2 border-b-2 mt-8 text-slate-400">Comments ({comments.length})</div>
      { isFetching && <Loader /> }
      { !error && comments && (
        <>
          {comments.length === 0
            ? <p className="mt-4">No comments yet. Be the first one to write!</p>
            : (
              <ul className="flex flex-col">
                {comments.map(({ id, authorName, message, createdAt }) => (
                  <li key={id}>
                    <div className="py-4 border-b-2">
                      {message}
                      <div className="mt-3 text-sm">By <b>{authorName}</b> on {readableDate(createdAt)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
        </>
      )}
      <div className="mt-4">
        <Textarea value={message} onChange={(message) => setMessage(message)} />
        <Button
          onClick={saveCommentHandler}
          disabled={(message ?? '').length === 0}
          isLoading={savingComment}
        >
          Save comment
        </Button>
      </div>
    </div>
  )
}