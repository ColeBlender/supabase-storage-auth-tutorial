"use client";

import { deleteImage, uploadImage } from "@/supabase/storage/client";
import { ChangeEvent, useRef, useState, useTransition } from "react";
import { convertBlobUrlToFile } from "@/lib/utils";
import Image from "next/image";
import { useGetUser } from "@/supabase/auth/client";
import toast from "react-hot-toast";
import { signOutAction } from "@/actions/auth";
import { updateUserAvatarAction } from "@/actions/users";
import { getAuth } from "@/supabase/auth/client";

function HomePage() {
  const user = useGetUser();

  const [imageUrl, setImageUrl] = useState("");

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const newImageUrl = URL.createObjectURL(file);

      setImageUrl(newImageUrl);
    }
  };

  const [isPending, startTransition] = useTransition();

  const handleClickUploadImagesButton = async () => {
    if (!user) {
      toast.error("You need to be logged in to upload image");
      return;
    }

    if (!imageUrl.length) {
      toast.error("Please select an image to upload");
      return;
    }

    startTransition(async () => {
      const imageFile = await convertBlobUrlToFile(imageUrl);

      const { imageUrl: avatarUrl, error } = await uploadImage({
        file: imageFile,
        bucket: "dank-pics",
        folder: user.id,
      });

      if (error) {
        toast.error(error);
        return;
      }

      await updateUserAvatarAction(avatarUrl);

      const auth = getAuth();
      await auth.updateUser({});

      toast.success("Successfully uploaded image");
      setImageUrl("");
    });
  };

  const handleClickDeleteImagesButton = async () => {
    if (!user) {
      toast.error("You need to be logged in to delete image");
      return;
    }

    if (!user.avatar_url) {
      toast.error("User doesn't have an image");
      return;
    }

    startTransition(async () => {
      const { data, error } = await deleteImage(user.avatar_url);

      if (error || !data?.length) {
        toast.error(error || "Failed to delete image");
        return;
      }

      await updateUserAvatarAction(null);

      const auth = getAuth();
      await auth.updateUser({});

      toast.success("Successfully deleted image");
    });
  };

  return (
    <div className="bg-slate-500 min-h-screen flex justify-center items-center flex-col gap-8">
      {user ? (
        <div className="flex gap-4">
          <button onClick={() => signOutAction()}>{user.email} Sign Out</button>
          {user.avatar_url && (
            <Image src={user.avatar_url} height={20} width={20} alt="avatar" />
          )}
        </div>
      ) : (
        <a href="/login">Click to login</a>
      )}

      <input
        type="file"
        hidden
        ref={imageInputRef}
        onChange={handleImageChange}
        disabled={isPending}
      />

      <button
        className="bg-slate-600 py-2 w-40 rounded-lg"
        onClick={() => imageInputRef.current?.click()}
        disabled={isPending}
      >
        Select Image
      </button>

      <div className="flex gap-4">
        {imageUrl && (
          <Image src={imageUrl} width={300} height={300} alt="image" />
        )}
      </div>

      <button
        onClick={handleClickUploadImagesButton}
        className="bg-slate-600 py-2 w-40 rounded-lg"
        disabled={isPending}
      >
        {isPending ? "Uploading..." : "Upload Image"}
      </button>

      <button
        onClick={handleClickDeleteImagesButton}
        className="bg-red-700 py-2 w-40 rounded-lg"
        disabled={isPending}
      >
        {isPending ? "Deleting..." : "Delete Image"}
      </button>
    </div>
  );
}

export default HomePage;
