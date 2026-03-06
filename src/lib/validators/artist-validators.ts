import * as yup from 'yup';

export const ArtistSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    dob: yup.date()
        .required("Date of Birth is required")
        .nullable()
        .transform((_, originalValue) => (originalValue ? new Date(originalValue) : null))
        .max(new Date(), "Date of Birth cannot be in the future")
        .test("is-valid-date", "Date of birth must be valid", (value) => value instanceof Date && !isNaN(value.getTime())),
    gender: yup.string().oneOf(['m', 'f', 'o'], 'Invalid gender').required('Gender is required'),
    address: yup.string().required('Address is required'),
    first_release_year: yup.number()
        .min(1900, 'First release year must be after 1900')
        .max(new Date().getFullYear(), `First release year cannot be after ${new Date().getFullYear()}`)
        .required('First release year is required'),
    no_of_albums_released: yup.number().integer().min(1, 'Number of albums must be at least 1').required('Number of albums released is required'),

    musics: yup.array().of(
        yup.object().shape({
            title: yup.string().required('Music title is required'),
            album_name: yup.string().required('Album name is required'),
            genre: yup.string().oneOf(['rnb', 'country', 'classic', 'rock', 'jazz'], 'Invalid genre').required('Genre is required')
        })
    ).min(1, 'At least one music entry is required')
});

export const ArtistEditSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    dob: yup.date()
        .required("Date of Birth is required")
        .nullable()
        .transform((_, originalValue) => (originalValue ? new Date(originalValue) : null))
        .max(new Date(), "Date of Birth cannot be in the future")
        .test("is-valid-date", "Date of birth must be valid", (value) => value instanceof Date && !isNaN(value.getTime())),
    gender: yup.string().oneOf(['m', 'f', 'o'], 'Invalid gender').required('Gender is required'),
    address: yup.string().required('Address is required'),
    first_release_year: yup.number()
        .min(1900, 'First release year must be after 1900')
        .max(new Date().getFullYear(), `First release year cannot be after ${new Date().getFullYear()}`)
        .required('First release year is required'),
    no_of_albums_released: yup.number().integer().min(1, 'Number of albums must be at least 1').required('Number of albums released is required'),
});

