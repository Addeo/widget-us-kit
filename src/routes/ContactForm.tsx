import { h, Fragment } from 'preact';
import { useContext, useState, useMemo, useEffect } from 'preact/hooks';
import style from './contactForm.css';
import { ConfigContext, ServiceContext } from '../AppContext';
// import Field from '../components/Field';
import { useIsMounted } from '../hooks';
import { RouteLink, RouterContext } from '../layout/Router';

const ContactForm = () => {
    const config = useContext(ConfigContext);
    const service = useContext(ServiceContext);
    const router = useContext(RouterContext);
    const mounted = useIsMounted();

    const [ratting, setRatting] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    const [emailValue, setEmailValue] = useState('');
    const emailError = useMemo(
        () => mounted.current && (!emailValue || !(/^\S+@\S+$/.test(emailValue)))
            ? 'Email is required and must be valid' : '',
        [emailValue, submitting, mounted]);

    const [messageValue, setMessageValue] = useState('');
    const messageError = useMemo(
        () => mounted.current && (!messageValue || messageValue.length < 5)
            ? 'Text is required and must contain at least 5 characters' : '',
        [messageValue, submitting, mounted]);

    const formValid = useMemo(
        () => ![emailError, messageError].reduce((m, n) => m + n),
        [emailError, messageError]);

    useEffect(() => {
        if (!submitting) {
            return;
        }
        setServerError(''); // reset previous server error
        if (!formValid) {
            setSubmitting(false);
            return;
        }

        console.log('Sending form', { emailValue, messageValue });
        service?.sendForm({ email: emailValue, message: messageValue })
            .then(() => {
                router.setRoute('/thankyou');
            })
            .catch(() => {
                setServerError(`Something went wrong and we couldn't send your form. Please try again later.`);
            })
            .then(() => setSubmitting(false));
    }, [formValid, submitting, emailValue, messageValue, service]);

    return (
        <div>
            {/*<p>{config.text.formSubTitle ??*/}
            {/*    <Fragment>*/}
            {/*        Leave your message and we'll get back to you shortly.*/}
            {/*        You can also read our <RouteLink href='/faq'>FAQ</RouteLink>.</Fragment>}*/}
            {/*</p>*/}
            <div className={style['rate-text-header']}>Ваша оценка</div>
            <div className={style['rate-text-subheader']}> Ваш отзыв будет передан руководству </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitting(true);
                }}>
                {serverError && <div className={style.error}>{serverError}</div>}

                <div>
                    <div className={style['rate-wrapper']}>
                        <div className={style['rate-panel-stars']}>
                            <div className={style['rate-buttons-wrapper']}>
                                <div className={style['rate-button']}>
                                    <div className={ratting >= 1 ? style['icon-selected'] : style['icon']}>
                                        <svg width='46' height='44' viewBox='0 0 46 44' xmlns='http://www.w3.org/2000/svg' class='selected'>
                                            <path data-v-f62fecb8='' d='M43.6902 15.7629L30.4489 13.8385L24.5298 1.83847C24.3681 1.50992 24.1021 1.24394 23.7736 1.08227C22.9496 0.675495 21.9483 1.01448 21.5363 1.83847L15.6171 13.8385L2.37588 15.7629C2.01082 15.815 1.67705 15.9871 1.42151 16.2479C1.11258 16.5654 0.942339 16.9926 0.948206 17.4356C0.954073 17.8786 1.13557 18.3011 1.4528 18.6103L11.033 27.9506L8.76963 41.1397C8.71656 41.4465 8.75051 41.762 8.86763 42.0505C8.98476 42.339 9.18038 42.5889 9.43231 42.7719C9.68424 42.9549 9.9824 43.0636 10.293 43.0858C10.6035 43.1079 10.9141 43.0426 11.1895 42.8972L23.033 36.6703L34.8766 42.8972C35.1999 43.0693 35.5754 43.1267 35.9353 43.0641C36.8427 42.9076 37.4529 42.0471 37.2964 41.1397L35.033 27.9506L44.6132 18.6103C44.874 18.3548 45.0461 18.021 45.0982 17.656C45.239 16.7433 44.6028 15.8985 43.6902 15.7629Z'></path></svg>
                                    </div>
                                    <div className={style['rate-button-text-wrapper']}>
                                        <div className={ratting >= 1 ? style['rate-button-text selected'] : style['rate-button-text']}> Ужасно </div>
                                    </div>
                                </div>
                                <div className={style['rate-button']}>
                                    <div className={ratting >= 2 ? style['icon-selected'] : style['icon']}>
                                        <svg width='46' height='44' viewBox='0 0 46 44' xmlns='http://www.w3.org/2000/svg' class='selected'>
                                            <path d='M43.6902 15.7629L30.4489 13.8385L24.5298 1.83847C24.3681 1.50992 24.1021 1.24394 23.7736 1.08227C22.9496 0.675495 21.9483 1.01448 21.5363 1.83847L15.6171 13.8385L2.37588 15.7629C2.01082 15.815 1.67705 15.9871 1.42151 16.2479C1.11258 16.5654 0.942339 16.9926 0.948206 17.4356C0.954073 17.8786 1.13557 18.3011 1.4528 18.6103L11.033 27.9506L8.76963 41.1397C8.71656 41.4465 8.75051 41.762 8.86763 42.0505C8.98476 42.339 9.18038 42.5889 9.43231 42.7719C9.68424 42.9549 9.9824 43.0636 10.293 43.0858C10.6035 43.1079 10.9141 43.0426 11.1895 42.8972L23.033 36.6703L34.8766 42.8972C35.1999 43.0693 35.5754 43.1267 35.9353 43.0641C36.8427 42.9076 37.4529 42.0471 37.2964 41.1397L35.033 27.9506L44.6132 18.6103C44.874 18.3548 45.0461 18.021 45.0982 17.656C45.239 16.7433 44.6028 15.8985 43.6902 15.7629Z'></path>
                                        </svg>
                                    </div>
                                    <div className={style['rate-button-text-wrapper']}>
                                        <div className={ratting >= 2 ? style['rate-button-text selected'] : style['rate-button-text']}> Плохо</div>
                                    </div>
                                </div>
                                <div className={style['rate-button']}>
                                    <div className={ratting >= 3 ? style['icon-selected'] : style['icon']}>
                                        <svg width='46' height='44' viewBox='0 0 46 44' xmlns='http://www.w3.org/2000/svg' class='selected'>
                                            <path d='M43.6902 15.7629L30.4489 13.8385L24.5298 1.83847C24.3681 1.50992 24.1021 1.24394 23.7736 1.08227C22.9496 0.675495 21.9483 1.01448 21.5363 1.83847L15.6171 13.8385L2.37588 15.7629C2.01082 15.815 1.67705 15.9871 1.42151 16.2479C1.11258 16.5654 0.942339 16.9926 0.948206 17.4356C0.954073 17.8786 1.13557 18.3011 1.4528 18.6103L11.033 27.9506L8.76963 41.1397C8.71656 41.4465 8.75051 41.762 8.86763 42.0505C8.98476 42.339 9.18038 42.5889 9.43231 42.7719C9.68424 42.9549 9.9824 43.0636 10.293 43.0858C10.6035 43.1079 10.9141 43.0426 11.1895 42.8972L23.033 36.6703L34.8766 42.8972C35.1999 43.0693 35.5754 43.1267 35.9353 43.0641C36.8427 42.9076 37.4529 42.0471 37.2964 41.1397L35.033 27.9506L44.6132 18.6103C44.874 18.3548 45.0461 18.021 45.0982 17.656C45.239 16.7433 44.6028 15.8985 43.6902 15.7629Z'></path>
                                        </svg>
                                    </div>
                                    <div className={style['rate-button-text-wrapper']}>
                                        <div className={ratting >= 3 ? style['rate-button-text selected'] : style['rate-button-text']}> Неплохо </div>
                                    </div>
                                </div>
                                <div className={style['rate-button']}>
                                    <div className={ratting >= 4 ? style['icon-selected'] : style['icon']}>
                                        <svg  width='46' height='44' viewBox='0 0 46 44' xmlns='http://www.w3.org/2000/svg' class='selected'>
                                            <path  d='M43.6902 15.7629L30.4489 13.8385L24.5298 1.83847C24.3681 1.50992 24.1021 1.24394 23.7736 1.08227C22.9496 0.675495 21.9483 1.01448 21.5363 1.83847L15.6171 13.8385L2.37588 15.7629C2.01082 15.815 1.67705 15.9871 1.42151 16.2479C1.11258 16.5654 0.942339 16.9926 0.948206 17.4356C0.954073 17.8786 1.13557 18.3011 1.4528 18.6103L11.033 27.9506L8.76963 41.1397C8.71656 41.4465 8.75051 41.762 8.86763 42.0505C8.98476 42.339 9.18038 42.5889 9.43231 42.7719C9.68424 42.9549 9.9824 43.0636 10.293 43.0858C10.6035 43.1079 10.9141 43.0426 11.1895 42.8972L23.033 36.6703L34.8766 42.8972C35.1999 43.0693 35.5754 43.1267 35.9353 43.0641C36.8427 42.9076 37.4529 42.0471 37.2964 41.1397L35.033 27.9506L44.6132 18.6103C44.874 18.3548 45.0461 18.021 45.0982 17.656C45.239 16.7433 44.6028 15.8985 43.6902 15.7629Z'></path>
                                        </svg>
                                    </div>
                                    <div className={style['rate-button-text-wrapper']}>
                                        <div className={ratting >= 4 ? style['rate-button-text selected'] : style['rate-button-text']}> Хорошо </div>
                                    </div>
                                </div>
                                <div className={style['rate-button']}>
                                    <div className={ratting >= 5 ? style['icon-selected'] : style['icon']}>
                                        <svg width='46' height='44' viewBox='0 0 46 44' xmlns='http://www.w3.org/2000/svg' class=''>
                                            <path  d='M43.6902 15.7629L30.4489 13.8385L24.5298 1.83847C24.3681 1.50992 24.1021 1.24394 23.7736 1.08227C22.9496 0.675495 21.9483 1.01448 21.5363 1.83847L15.6171 13.8385L2.37588 15.7629C2.01082 15.815 1.67705 15.9871 1.42151 16.2479C1.11258 16.5654 0.942339 16.9926 0.948206 17.4356C0.954073 17.8786 1.13557 18.3011 1.4528 18.6103L11.033 27.9506L8.76963 41.1397C8.71656 41.4465 8.75051 41.762 8.86763 42.0505C8.98476 42.339 9.18038 42.5889 9.43231 42.7719C9.68424 42.9549 9.9824 43.0636 10.293 43.0858C10.6035 43.1079 10.9141 43.0426 11.1895 42.8972L23.033 36.6703L34.8766 42.8972C35.1999 43.0693 35.5754 43.1267 35.9353 43.0641C36.8427 42.9076 37.4529 42.0471 37.2964 41.1397L35.033 27.9506L44.6132 18.6103C44.874 18.3548 45.0461 18.021 45.0982 17.656C45.239 16.7433 44.6028 15.8985 43.6902 15.7629Z'></path>
                                        </svg>
                                </div>
                                    <div className={style['rate-button-text-wrapper']}>
                                        <div className={ratting >= 5 ? style['rate-button-text selected'] : style['rate-button-text']}> Супер</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style['response-form']}>
                    <div className={style['textarea-wrapper']}>
                        <div className={style['textarea-oval']}>
                            <div className={style['label-oval-wrapper']}>
                                <label for='story' className={style['label-oval red-asterisk']}>Комментарий </label>
                            </div>
                            <textarea
                                id='story'
                                rows={4}
                                placeholder='Введите текст' maxlength={180} class={style['textarea-input']}></textarea>
                            <div className={style['textarea-counter']}>0/180</div>
                        </div>
                    </div>
                </div>
                {/*<Field*/}
                {/*    name='email'*/}
                {/*    title='Email'*/}
                {/*    error={emailError}*/}
                {/*    render={(inputProps) => (*/}
                {/*        <input*/}
                {/*            type='text'*/}
                {/*            inputMode='email'*/}
                {/*            disabled={submitting}*/}
                {/*            placeholder='me@home.com'*/}
                {/*            autoFocus*/}
                {/*            onInput={(e) => setEmailValue(e.currentTarget.value)}*/}
                {/*            {...inputProps}*/}
                {/*        />)} />*/}
                {/*<Field*/}
                {/*    name='message'*/}
                {/*    title='Message'*/}
                {/*    error={messageError}*/}
                {/*    render={(inputProps) => (*/}
                {/*        <textarea*/}
                {/*            rows={7}*/}
                {/*            disabled={submitting}*/}
                {/*            autoComplete='disable'*/}
                {/*            onInput={(e) => setMessageValue(e.currentTarget.value)}*/}
                {/*            {...inputProps}*/}
                {/*        />)} />*/}

                <div className={style['button-container']}>
                    <button type='submit' disabled={submitting || !formValid} class={style['buttonText']}>
                        {submitting ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
            <div className={style['disclaimer-container']}>
                <p className={style['disclaimer-text']}>
                    Нажимая кнопку “Отправить”,<br></br>вы соглашаетесь с
                    {/* tslint:disable-next-line:max-line-length */}
                    <a href='https://docs.google.com/document/d/18ccRmhu1-tFramWheRfVQ4-iEGMckv7pKJm1pt-xSW0'>
                        условиями использования
                    </a>
                </p>
            </div>
        </div >);
};

export default ContactForm;
