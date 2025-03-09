
import type React from "react"
import { useRef, useState } from "react"
import { userProfile } from "../utils/data"
import { useAuthStore } from "../store/AuthStore"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchUser, updateUserProfilePicture } from "../utils/apis"

const ProfilePage: React.FC = () => {
  
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { currentUser, updateCurrentUser } = useAuthStore()
  const queryClient = useQueryClient()

  const { data, isPending, isError } = useQuery({
    queryKey: ["profile", currentUser?.id as string],
    queryFn: () => fetchUser(currentUser?.id as string),
    enabled: !!currentUser,
  })

  // console.log(data)

  // Mutation for uploading profile image
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return updateUserProfilePicture(currentUser?.id as string, formData);
    },
    onSuccess: (data) => {
      // Update the user in the auth store with the new image URL
      if (currentUser) {
        updateCurrentUser({ ...currentUser, image: data.image });
      }
  
      // Invalidate the user query to refetch the updated user data
      queryClient.invalidateQueries({ queryKey: ["profile", currentUser?.id as string] });
    },
    onError: (error) => {
      console.error("Error in mutation", error);
      alert("There was an error uploading the image.");
    },
  });
  

  if (isPending) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (isError) {
    return <div className="flex items-center justify-center h-screen">Something went wrong!</div>
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Trigger the image upload as soon as the file is selected
      handleImageUpload(file)
    }
  }

  // Function to trigger the file input when the image is clicked
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Function to handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }
  
    setIsUploading(true);
  
    try {
      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append("file", file);
  
      // Use the mutation to upload the image
      await uploadMutation.mutateAsync(formData);
  
      setIsUploading(false);
    } catch (error) {
      console.error("Error uploading image", error);
      alert("There was an error uploading the image.");
      setIsUploading(false);
    }
  };
  

  return (
    <div className="w-full mx-auto p-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center">
        {/* Profile Image with Upload Functionality */}
        <div className="relative">
          {isUploading ? (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : currentUser?.image ? (
            <button onClick={handleImageClick} className="relative group" disabled={isUploading}>
              <img
                src={currentUser.image || "/placeholder.svg"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>
          ) : (
            <button onClick={handleImageClick} className="relative group" disabled={isUploading}>
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center font-bold text-3xl">
                {currentUser?.name.charAt(0)}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Upload</span>
              </div>
            </button>
          )}
        </div>

        {/* Hidden File Input */}
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

        <h1 className="text-2xl font-semibold mt-2">{currentUser?.name}</h1>
        <p className="text-gray-600">{currentUser?.username}</p>
        <p className="text-gray-500 mt-1">
          {userProfile.followers} followers • {userProfile.following} following
        </p>
        <div className="mt-4 space-x-2">
          <button className="bg-gray-200 px-4 py-2 rounded-lg">Message</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg">Follow</button>
        </div>
      </div>

      {/* Uploaded Images */}
      <div className="mt-6 w-full">
        <h2 className="text-xl font-semibold mb-4">Uploaded Pins</h2>
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 gap-3 p-4">
          {data?.pins.map((pin: any, index: number) => (
            <div key={index} className="mb-4 break-inside-avoid">
              <img
                src={pin?.image || "/placeholder.svg"}
                alt="Image"
                className="w-full rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

