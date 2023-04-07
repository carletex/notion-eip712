import React, { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { useAccount, useSignTypedData } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { EIP_712_DOMAIN, EIP_712_TYPES } from "~~/eip712";
import { notification } from "~~/utils/scaffold-eth";

interface SubmissionData {
  name?: string;
  message?: string;
  url?: string;
}

const emtpyData = {
  name: "",
  message: "",
  url: "",
};

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState(emtpyData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<SubmissionData>({});

  const {
    signTypedData,
    data,
    isSuccess: signingSuccess,
  } = useSignTypedData({
    domain: EIP_712_DOMAIN,
    types: EIP_712_TYPES,
    value: {
      ...formData,
      from: address || "",
    },
  });

  useEffect(() => {
    const sendPostToBackend = async () => {
      try {
        const payload = {
          ...formData,
          from: address,
          signature: data,
          values: formData,
        };
        const response = await fetch("/api/submissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.status === 200) {
          notification.success(<span className="font-bold">Submission received! 🎉</span>);
          setFormData(emtpyData);
          setIsSubmitted(true);
        } else {
          notification.error(
            <>
              <span className="font-bold">Server Error.</span>
              <br />
              Something went wrong. Please try again
            </>,
          );
        }
      } catch (error) {
        console.error(error);
        notification.error(
          <>
            <span className="font-bold">Server Error.</span>
            <br />
            Something went wrong. Please try again
          </>,
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    if (signingSuccess) {
      console.log("signingSuccess", data);
      sendPostToBackend();
    }
  }, [signingSuccess, data]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      signTypedData();
    } else {
      setErrors(validationErrors);
      setIsSubmitting(false);
    }
  };

  const validateForm = (formData: SubmissionData) => {
    const errors: SubmissionData = {};
    const urlRegex = /^(http|https):\/\/[^ "]+$/;

    if (!formData.name) errors.name = "Name is required";
    if (!formData.message) errors.message = "Message is required";
    if (formData.url && !urlRegex.test(formData.url)) errors.url = "URL is invalid";

    return errors;
  };

  return (
    <>
      <Head>
        <title>Scaffold-eth App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="bg-secondary w-[90%] max-w-2xl p-10">
          <h1 className="text-center font-bold text-2xl">Submit to Notion</h1>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col">
              <div className="flex flex-col relative">
                <label className="font-bold" htmlFor="title">
                  Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  className="input border-secondary mt-2 mb-6"
                  onChange={handleChange}
                />
                {errors.name && <div className="text-error absolute right-0 bottom-0 text-sm">{errors.name}</div>}
              </div>

              <div className="flex flex-col relative">
                <label className="font-bold" htmlFor="description">
                  Message <span className="text-error">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  rows={3}
                  className="input border-secondary mt-2 mb-6 h-auto textarea"
                  onChange={handleChange}
                />
                {errors.message && <div className="text-error absolute right-0 bottom-0 text-sm">{errors.message}</div>}
              </div>

              <div className="flex flex-col relative mb-6">
                <label className="font-bold" htmlFor="githubURL">
                  URL
                </label>
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={formData.url}
                  className="input border-secondary mt-2 mb-6"
                  onChange={handleChange}
                />
                {errors.url && <div className="text-error absolute right-0 bottom-0 text-sm">{errors.url}</div>}
              </div>

              {isConnected ? (
                <button type="submit" className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}>
                  Submit
                </button>
              ) : (
                <RainbowKitCustomConnectButton />
              )}
            </form>
          ) : (
            <div className="flex flex-col items-center text-center">
              <p className="text-2xl font-archivo-black">Thank you for submitting!</p>
              <button className="btn btn-ghost" onClick={() => setIsSubmitted(false)}>
                Go back
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
