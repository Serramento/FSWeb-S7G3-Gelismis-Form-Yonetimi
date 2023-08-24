import axios from 'axios';
import React, {useState, useEffect} from 'react';
import * as Yup from 'yup';

const initialData= {
    isim: "",
    eposta: "",
    sifre: "",
    sartlar: false
}

const initialErrors= {
    isim: "",
    eposta: "",
    sifre: "",
    sartlar: ""
}

const formSchema = Yup.object().shape({
    isim: Yup
        .string()
        .min(5, "İsim alanı en az 5 karakter olmalıdır.")
        .required("İsim alanını doldurmadınız."),
    eposta: Yup
        .string()
        .email("Geçerli e-mail girmediniz.")
        .required("E-mail girmediniz."),
    sifre: Yup
        .string()
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/, "En az 8 karakter, 1 büyük 1 küçük harf, bir sembol olmalıdır.")
        .min(8, "En az 8 karakter olmalıdır.")
        .required("Şifre alanı gereklidir."),
    sartlar: Yup
        .boolean()
        .oneOf([true], "Şartları kabul etmelisiniz.")
        .required("Şartları kabul etmediniz.")
})

const url = "https://reqres.in/api/users";

const Form = (props) => {

    const [formData, setFormData] = useState(initialData);

    const[errors, setErrors] = useState(initialErrors);

    const [isValid, setIsValid] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if(isValid){
        axios.post(url, formData)
            .then((response) => {
                console.log(response);
                setFormData(initialData);
            })
            .catch((error) => {
                console.error(error);
            })
        }else{
            alert("formu doldurduğunuza emin olunuz.")
        }
    }

    const handleChange = (event) => {

        const {name, type, value, checked} = event.target;
        let valuex = (type === "checkbox") ? checked: value;
        setFormData({...formData, [name] : value})
        Yup.reach(formSchema, name)
            .validate(valuex)
            .then((success) => {
                setErrors({...errors, [name] : ""})
            })
            .catch(err => {
                setErrors({...errors, [name]: err.errors[0]})
            })
    }

    useEffect(() => {
        formSchema.isValid(formData)
        .then((valid) => {
            setIsValid(!valid)
        })
    }, [formData]);

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type= "text"
                        name = "isim"
                        value = {formData.isim}
                        onChange = {handleChange}
                    />
                </label>

                <p>{errors.isim}</p>

                <label>
                    E-mail:
                    <input
                        type= "email"
                        name = "eposta"
                        value = {formData.eposta}
                        onChange = {handleChange}
                    />
                </label>

                <p>{errors.eposta}</p>

                <label>
                    Password:
                    <input
                        type= "password"
                        name = "sifre"
                        value = {formData.sifre}
                        onChange = {handleChange}
                    />
                </label>

                <p>{errors.sifre}</p>

                <label>    
                    <input
                        type= "checkbox"
                        name = "sartlar"
                        value = {formData.sartlar}
                        onChange = {handleChange}
                    />
                    Şartları kabul ediyorum:
                </label>

                <p>{errors.sartlar}</p>

                <button disabled= {!isValid}>
                    Submit
                </button>

            </form>
        </div>
    )
}

export default Form;