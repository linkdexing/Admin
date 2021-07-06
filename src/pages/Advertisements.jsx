import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { privateApi } from '../api';
import { advertisementUrl } from '../api/endpoints';

export default function Advertisements() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('type', values.type);
      formData.append('url', values.url);
      formData.append('image', values.image[0]);

      await privateApi.post(`${advertisementUrl}`, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Advertisements changed successfully');
    } catch (err) {
      toast.error(
        err.response?.data.message ||
          'Something went wrong, Please try again later.'
      );
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Placement of Advertisements</label>
          <select
            className="form-select"
            aria-label="Default select example"
            defaultValue=""
            id="type"
            {...register('type', {
              required: 'Select a position',
            })}
          >
            <option disabled value="">
              Select placement of Advertisements
            </option>
            <option value="top-left">Top-Left</option>
            <option value="bottom-right">Right Under menu</option>
          </select>
          {errors?.type && (
            <span className="text-danger">{errors.type.message}</span>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="url" className="form-label">
            Enter the URL
          </label>
          <input
            type="text"
            className="form-control"
            id="url"
            {...register('url', {
              required: 'Please enter a valid URL',
              pattern: {
                value:
                  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/,
                message: 'Please enter a valid URL',
              },
            })}
          />
          {errors?.url && (
            <span className="text-danger">{errors.url.message}</span>
          )}
        </div>

        <div className="mb-3">
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Upload the image
            </label>
            <input
              className="form-control"
              type="file"
              accept=".jpg,.png,.jpeg,.gif"
              id="image"
              {...register('image', {
                required: 'Upload an image',
                validate: async (file) => {
                  var reader = new FileReader();
                  //Read the contents of Image File.
                  reader.readAsDataURL(file[0]);
                  var flag = true;
                  const loadOuter = async () =>
                    new Promise((resolve) => {
                      reader.onload = async function (e) {
                        //Initiate the JavaScript Image object.
                        var image = new Image();

                        //Set the Base64 string return from FileReader as source.
                        image.src = e.target.result;

                        //Validate the File Height and Width.
                        image.onload = function () {
                          var height = this.height;
                          var width = this.width;
                          if (height > 100 || width > 100) {
                            flag = false;
                            //console.log(flag);
                            return resolve();
                          }

                          return resolve();
                        };

                        //console.log(flag);
                      };
                    });
                  await loadOuter();
                  return (
                    flag || 'Height and width must not exceed required size'
                  );
                },
              })}
            />
            {errors?.image && (
              <span className="text-danger">{errors.image.message}</span>
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
