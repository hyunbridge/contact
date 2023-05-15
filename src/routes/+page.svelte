<script>
  import { Recaptcha, recaptcha, observer } from "svelte-recaptcha-v2";
  import axios from "axios";
  import Swal from "sweetalert2";

  let subject = "";
  let email = "";

  let isSubmitEnabled = false;
  let isPendingUserAction = false;
  let isLoading = false;

  let resetRecaptcha = 0;

  const thisYear = new Date().getFullYear();

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    recaptcha.execute();
    const recaptchaEvent = await Promise.resolve(observer);
    const recaptchaToken = recaptchaEvent.detail?.token
      ? recaptchaEvent.detail.token
      : false;

    isSubmitEnabled = false;
    isLoading = true;

    let hasError = false;
    let response;
    try {
      response = await axios.post("/.netlify/functions/send-email", {
        subject: subject,
        email: email,
        recaptcha_token: recaptchaToken,
      });
    } catch (error) {
      hasError = true;
      if (axios.isAxiosError(error)) {
        response = error.response;
      }
    }

    const message = response?.data["message"]
      ? response.data["message"]
      : "An error occurred.";
    Swal.fire({
      icon: hasError ? "error" : "success",
      title: message,
      confirmButtonText: "Close",
      customClass: {
        confirmButton:
          "mt-5 mb-4 justify-center text-white bg-blue-600 hover:bg-blue-500 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-xl px-5 py-3 text-center items-center",
      },
      buttonsStyling: false,
    });

    isSubmitEnabled = true;
    isLoading = false;
    subject = "";
    email = "";
  };

  const onCaptchaReady = () => {
    if (!isLoading) {
      isSubmitEnabled = true;
    }
  };

  const onCaptchaSuccess = (event) => {
    observer.resolve(event);
    isPendingUserAction = false;
    resetRecaptcha += 1;
  };

  const onCaptchaOpen = () => {
    isPendingUserAction = false;
  };

  const onCaptchaClose = () => {
    isPendingUserAction = true;
  };
</script>

<svelte:head>
  <title>Contact</title>
  <meta name="description" content="Get in touch with Hyungyo Seo" />
</svelte:head>

<div class="flex h-screen justify-center items-center">
  <div class="bg-white px-6 py-24 sm:py-32 lg:px-8">
    <h2 class="text-center text-4xl font-bold leading-9 text-gray-900">
      Contact me
    </h2>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" on:submit={handleOnSubmit}>
        <div>
          <div class="flex items-center justify-between">
            <label
              for="subject"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Subject</label
            >
          </div>
          <div class="mt-2">
            <input
              bind:value={subject}
              id="subject"
              name="subject"
              type="text"
              required
              class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Your email address</label
          >
          <div class="mt-2">
            <input
              bind:value={email}
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            disabled={!isSubmitEnabled}
            type="submit"
            class="flex w-full relative justify-center text-white bg-blue-600 hover:bg-blue-500 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-xl px-5 py-3 text-center mr-2 items-center"
          >
            {#if isPendingUserAction}
              <span class="flex absolute h-5 w-5 top-0 right-0 -mt-2 -mr-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                />
                <span
                  class="relative inline-flex rounded-full h-5 w-5 bg-red-500"
                />
              </span>
            {/if}
            {#if isLoading}
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Please wait...
            {:else}
              Submit
            {/if}
          </button>
        </div>
      </form>
      <p class="mt-10 text-center text-sm text-gray-500">
        This site is protected by reCAPTCHA and the Google
        <a
          href="https://policies.google.com/privacy"
          class="font-semibold text-blue-600 hover:text-blue-500"
          >Privacy Policy</a
        >
        and
        <a
          href="https://policies.google.com/terms"
          class="font-semibold text-blue-600 hover:text-blue-500"
          >Terms of Service</a
        > apply.
      </p>
      <p class="mt-5 text-center text-sm text-gray-500">
        © {thisYear} <span class="font-semibold">Hyungyo Seo</span>. All Rights
        Reserved.
      </p>
    </div>
  </div>
</div>

{#key resetRecaptcha}
  <Recaptcha
    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
    size={"invisible"}
    on:ready={onCaptchaReady}
    on:success={onCaptchaSuccess}
    on:open={onCaptchaOpen}
    on:close={onCaptchaClose}
    display="none"
  />
{/key}
