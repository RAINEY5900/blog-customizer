import { FormEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
	OptionType,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	currentArticleState: ArticleStateType;
	setCurrentArticleState: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	currentArticleState,
	setCurrentArticleState,
}: ArticleParamsFormProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [formState, setFormState] =
		useState<ArticleStateType>(currentArticleState);

	const asideRef = useRef<HTMLElement>(null);
	const arrowButtonRef = useRef<HTMLDivElement>(null);

	const handleToggleMenu = () => {
		setIsMenuOpen((prevIsOpen) => !prevIsOpen);
	};

	useEffect(() => {
		if (!isMenuOpen) {
			return;
		}

		const handleOutsideClick = (event: MouseEvent) => {
			const { target } = event;
			if (!(target instanceof Node)) {
				return;
			}
			const isOutsideAside = !asideRef.current?.contains(target);
			const isOutsideArrowButton = !arrowButtonRef.current?.contains(target);
			if (isOutsideAside && isOutsideArrowButton) {
				setIsMenuOpen(false);
			}
		};

		window.addEventListener('mousedown', handleOutsideClick);

		return () => {
			window.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isMenuOpen]);

	const handleFieldChange =
		(fieldName: keyof ArticleStateType) => (option: OptionType) => {
			setFormState((prevState) => ({
				...prevState,
				[fieldName]: option,
			}));
		};

	const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setCurrentArticleState(formState);
	};

	const handleFormReset = () => {
		setFormState(defaultArticleState);
		setCurrentArticleState(defaultArticleState);
	};

	return (
		<>
			<div ref={arrowButtonRef}>
				<ArrowButton isOpen={isMenuOpen} onClick={handleToggleMenu} />
			</div>
			<aside
				ref={asideRef}
				className={clsx(styles.container, {
					[styles.container_open]: isMenuOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleFormSubmit}
					onReset={handleFormReset}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<Select
						title='Шрифт'
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={handleFieldChange('fontFamilyOption')}
					/>
					<RadioGroup
						name='fontSize'
						title='Размер шрифта'
						selected={formState.fontSizeOption}
						options={fontSizeOptions}
						onChange={handleFieldChange('fontSizeOption')}
					/>
					<Select
						title='Цвет шрифта'
						selected={formState.fontColor}
						options={fontColors}
						onChange={handleFieldChange('fontColor')}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={handleFieldChange('backgroundColor')}
					/>
					<Select
						title='Ширина контента'
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={handleFieldChange('contentWidth')}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
