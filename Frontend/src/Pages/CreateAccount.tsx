import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAbout,setLeetcodeLink,setGithubLink } from '../../features/userSlice'; 

const CreateAccount: React.FC = () => {
    const [formData, setFormData] = useState({
        about: '',
        gitHub: '',
        linkedin: '',
    });

    const [formStep, setFormStep] = useState(1);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();
    const dispatch = useDispatch(); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'about' && value.split(' ').length > 50) {
            return; // Prevent typing beyond 50 words
        }
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error message on change
    };

    const validateStep1 = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.about) newErrors.about = 'Please tell us about yourself';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.linkedin) {
            newErrors.linkedin = 'LinkedIn URL is required';
        }
        if (!formData.gitHub) {
            newErrors.gitHub = 'GitHub URL is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        if (formStep === 1 && validateStep1()) {
            // Dispatch the about information
            dispatch(setAbout(formData.about));
            setFormStep(2);
        } else if (formStep === 2 && validateStep2()) {
            // Dispatch the GitHub and LinkedIn links
            dispatch(setGithubLink(formData.gitHub));
            dispatch(setLeetcodeLink(formData.linkedin));
            navigate('/');
        }
    };


    const handleSkip = (e: React.FormEvent) => {
        e.preventDefault();
        if (formStep === 1) {
            setFormStep(2);
        } else if (formStep === 2) {
            navigate('/');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep2()) {
            // Dispatch the GitHub and LinkedIn links
            dispatch(setGithubLink(formData.gitHub));
            dispatch(setLeetcodeLink(formData.linkedin));
            console.log(formData);
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mainbg dark:bg-black w-full">
            <form className="flex gap-4 w-4/5 p-8 bg-muted/50 border rounded-lg shadow-xl" onSubmit={handleSubmit}>
                <div className='flex gap-4 flex-col w-full justify-between'>
                    <div className='flex gap-4 flex-col'>
                        <div className="flex items-center">
                            <p className="text-2xl font-semibold text-cyan-500 relative flex items-center pl-7">
                                Profile Details
                                <span className="absolute left-0 w-4 h-4 rounded-full bg-cyan-500"></span>
                                <span className="absolute left-0 w-4 h-4 rounded-full bg-cyan-500 animate-pulse"></span>
                            </p>
                        </div>

                        {formStep === 1 && (
                            <>
                                <p className="text-sm text-gray-400">Tell us more about yourself</p>
                                <label className="relative w-full">
                                    <textarea
                                        className={`bg-muted/50  text-textmain dark:text-white w-full p-4 pt-5 rounded-lg border ${errors.about ? 'border-red-600' : 'border-gray-600'} outline-none placeholder-transparent focus:placeholder-transparent`}
                                        name="about"
                                        placeholder="Tell us about yourself (max 50 words)"
                                        value={formData.about}
                                        onChange={handleChange}
                                        rows={4}
                                        required
                                    />
                                    <span className={`absolute left-3 top-1 transition-all duration-300 ${formData.about ? 'text-xs -top-3 text-cyan-500' : 'text-sm top-3 text-blue-400'} pointer-events-none`}>
                                        About
                                    </span>
                                    {errors.about && <p className="text-red-500 text-xs mt-1">{errors.about}</p>}
                                </label>
                                <div className="flex gap-2 mt-4">
                                    <button className="w-full py-3 rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-all" onClick={handleSkip}>
                                        Skip
                                    </button>
                                    <button className="w-full py-3 rounded-lg text-white bg-cyan-500 hover:bg-cyan-600 transition-all" onClick={handleNext}>
                                        Save & Next
                                    </button>
                                </div>
                            </>
                        )}

                        {formStep === 2 && (
                            <>
                                <p className="text-sm text-gray-400">Provide your social links</p>
                                <label className="relative w-full">
                                    <input
                                        className={`bg-muted/50  text-textmain dark:text-white  w-full p-4 pt-5 rounded-lg border ${errors.linkedin ? 'border-red-600' : 'border-gray-600'} outline-none placeholder-transparent focus:placeholder-transparent`}
                                        type="url"
                                        name="linkedin"
                                        placeholder="LinkedIn"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className={`absolute left-3 top-1 transition-all duration-300 ${formData.linkedin ? 'text-xs -top-3 text-cyan-500' : 'text-sm top-3 text-blue-400'} pointer-events-none`}>
                                        LinkedIn
                                    </span>
                                    {errors.linkedin && <p className="text-red-500 text-xs mt-1">{errors.linkedin}</p>}
                                </label>
                                <label className="relative w-full">
                                    <input
                                        className={`bg-muted/50  text-textmain dark:text-white  w-full p-4 pt-5 rounded-lg border ${errors.gitHub ? 'border-red-600' : 'border-gray-600'} outline-none placeholder-transparent focus:placeholder-transparent`}
                                        type="url"
                                        name="gitHub"
                                        placeholder="GitHub"
                                        value={formData.gitHub}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span className={`absolute left-3 top-1 transition-all duration-300 ${formData.gitHub ? 'text-xs -top-3 text-cyan-500' : 'text-sm top-3 text-blue-400'} pointer-events-none`}>
                                        GitHub
                                    </span>
                                    {errors.gitHub && <p className="text-red-500 text-xs mt-1">{errors.gitHub}</p>}
                                </label>
                                <div className="flex gap-2 mt-4">
                                    <button className="w-full py-3 rounded-lg text-white bg-gray-600 hover:bg-gray-700 transition-all" onClick={handleSkip}>
                                        Skip
                                    </button>
                                    <button className="w-full py-3 rounded-lg text-white bg-cyan-500 hover:bg-cyan-600 transition-all" onClick={handleSubmit}>
                                        Save & Next
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="join">
                        <input
                            className="join-item btn btn-square"
                            type="radio"
                            name="options"
                            aria-label="1"
                            defaultChecked
                        />
                        <input className="join-item btn btn-square" type="radio" name="options" aria-label="2" />
                    </div>
                </div>
                <img src="/growth.png" alt="" className='relative z-10' />
                <div className="shadow"></div>
            </form>
        </div>
    );
};

export default CreateAccount;
