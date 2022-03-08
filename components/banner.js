import styles from './banner.module.css'

const Banner = (props) => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                <span className={styles.title1}>Boba</span>
                <span className={styles.title2}>loca</span>
            </h1>
            <p className={styles.subTitle}>Discover local boba tea shops!</p>
            <div className={styles.buttonWrapper}>
            <button className={styles.button} onClick={props.handleOnClick}>{props.buttonText}</button>
            </div>
        </div>
    )
}

export default Banner