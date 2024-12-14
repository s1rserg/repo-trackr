import {
	Button,
	Icon,
	IconButton,
	Input,
	Modal,
} from "~/libs/components/components.js";
import { DataStatus } from "~/libs/enums/enums.js";
import {
	useAppDispatch,
	useAppForm,
	useAppSelector,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "~/libs/hooks/hooks.js";
import { actions as projectApiKeyActions } from "~/modules/project-api-keys/project-api-keys.js";
import { type ProjectGetByIdResponseDto } from "~/modules/projects/projects.js";
import { actions as scriptActions } from "~/modules/scripts/scripts.js";

import styles from "./styles.module.css";
import {
	type ProjectConfigureAnalyticsRequestDto,
	projectConfigureAnalyticsValidationSchema,
} from "~/libs/types/types.js";

type Properties = {
	isOpened: boolean;
	onClose: () => void;
	project: ProjectGetByIdResponseDto;
	onConfigureAnalyticsSubmit: (
		payload: ProjectConfigureAnalyticsRequestDto,
	) => void;
};

const SetupAnalyticsModal = ({
	isOpened,
	onClose,
	project,
	onConfigureAnalyticsSubmit,
}: Properties): JSX.Element => {
	const dispatch = useAppDispatch();

	const { dataStatus, generateKeyDataStatus } = useAppSelector(
		({ projectApiKeys }) => projectApiKeys,
	);
	const { authenticatedUser } = useAppSelector(({ auth }) => auth);

	const [activeTab, setActiveTab] = useState<
		"gitScript" | "githubAnalytics" | ""
	>("");

	const handleTabChange = (tab: "gitScript" | "githubAnalytics"): void => {
		setActiveTab(tab);
	};

	const {
		control: analyticsControl,
		errors: analyticsErrors,
		handleSubmit: analyticsHandleSubmit,
	} = useAppForm<ProjectConfigureAnalyticsRequestDto>({
		defaultValues: { apiKey: "", repositoryUrl: "" },
		validationSchema: projectConfigureAnalyticsValidationSchema,
	});

	const hasProjectApiKey = project.apiKey !== null;
	const hasAuthenticatedUser = authenticatedUser !== null;

	const isKeyGenerated = generateKeyDataStatus === DataStatus.FULFILLED;

	const isGenerateButtonDisabled = dataStatus === DataStatus.PENDING;
	const isCopyButtonDisabled =
		!hasProjectApiKey || dataStatus === DataStatus.PENDING;

	const pm2StartupScript = "pm2 startup";

	const analyticsScript = useMemo<string>(() => {
		if (!hasProjectApiKey || !hasAuthenticatedUser) {
			return "";
		}

		const apiKey = project.apiKey as string;
		const userId = String(authenticatedUser.id);

		return `npx @repo-trackr/analytics@latest track ${apiKey} ${userId} <project-path>`;
	}, [hasProjectApiKey, hasAuthenticatedUser, project, authenticatedUser]);

	const { control, errors, handleSubmit, handleValueSet } = useAppForm({
		defaultValues: {
			analyticsScript,
			apiKey: project.apiKey ?? "",
			pm2StartupScript,
			projectId: project.id,
		},
	});

	const handleGenerateSubmit = useCallback(
		(event_: React.BaseSyntheticEvent): void => {
			void handleSubmit(({ projectId }) => {
				void dispatch(projectApiKeyActions.create({ projectId }));
			})(event_);
		},
		[handleSubmit, dispatch],
	);

	const handleAnalyticsSubmit = useCallback(
		(event_: React.BaseSyntheticEvent): void => {
			void analyticsHandleSubmit(
				(formData: ProjectConfigureAnalyticsRequestDto) => {
					onConfigureAnalyticsSubmit(formData);
				},
			)(event_);
		},
		[analyticsHandleSubmit, onConfigureAnalyticsSubmit],
	);

	const handleCopyApiKeyToClipboard = useCallback(
		(input: string) => {
			void dispatch(projectApiKeyActions.copyToClipboard(input));
		},
		[dispatch],
	);

	const handleCopyScriptToClipboard = useCallback(
		(input: string) => {
			void dispatch(scriptActions.copyToClipboard(input));
		},
		[dispatch],
	);

	const handleCopyAPIKeyClick = useCallback(() => {
		handleCopyApiKeyToClipboard(project.apiKey as string);
	}, [handleCopyApiKeyToClipboard, project]);

	const handleCopyAnalyticsScriptClick = useCallback(() => {
		handleCopyScriptToClipboard(analyticsScript);
	}, [handleCopyScriptToClipboard, analyticsScript]);

	const handleCopyStartupScriptClick = useCallback(() => {
		handleCopyScriptToClipboard(pm2StartupScript);
	}, [handleCopyScriptToClipboard, pm2StartupScript]);

	useEffect(() => {
		handleValueSet("apiKey", project.apiKey ?? "");
	}, [handleValueSet, project.apiKey]);

	useEffect(() => {
		handleValueSet("analyticsScript", analyticsScript);
	}, [handleValueSet, analyticsScript]);

	return (
		<Modal isOpened={isOpened} onClose={onClose} title="Setup Analytics">
			<div className={styles["content"]}>
				{!activeTab && (
					<>
						<Button
							label="Git Script"
							onClick={() => {
								handleTabChange("gitScript");
							}}
							variant="default"
						/>
						<Button
							label="GitHub Analytics"
							onClick={() => {
								handleTabChange("githubAnalytics");
							}}
							variant="outlined"
						/>
					</>
				)}
				{activeTab === "gitScript" && (
					<>
						<div>
							<span className={styles["subtitle"]}>Overview</span>
							<p className={styles["text"]}>
								This script operates continuously in the background, collecting
								statistics and updating analytics data every 3 hours.
							</p>
						</div>

						<form
							className={styles["api-key-container"]}
							onSubmit={handleGenerateSubmit}
						>
							<Input
								control={control}
								errors={errors}
								isReadOnly
								label="API key"
								name="apiKey"
								placeholder="No API key"
								{...(isKeyGenerated
									? {
											leftIcon: (
												<div className={styles["generated-key-indicator"]}>
													<Icon height={20} name="check" width={20} />
												</div>
											),
										}
									: {})}
								rightIcon={
									<IconButton
										iconName="clipboard"
										isDisabled={isCopyButtonDisabled}
										label="Copy API key"
										onClick={handleCopyAPIKeyClick}
									/>
								}
							/>
							<div className={styles["button-wrapper"]}>
								<Button
									isDisabled={isGenerateButtonDisabled}
									label={hasProjectApiKey ? "Regenerate" : "Generate"}
									type="submit"
								/>
							</div>
						</form>

						<div>
							<span className={styles["subtitle"]}>Prerequisites</span>
							<ul className={styles["text"]}>
								<li>
									<span className={styles["list-item-title"]}>Git</span>: Ensure
									Git is installed for repository management.
								</li>
								<li>
									<span className={styles["list-item-title"]}>Node.js 20</span>:
									The script requires Node.js 20 to be installed on your
									machine.
								</li>
								<li>
									<span className={styles["list-item-title"]}>PM2 5.4</span>:
									The script requires PM2 5.4 to be installed on your machine.
								</li>
								<li>
									<span className={styles["list-item-title"]}>
										Unix-based system
									</span>
									: The script requires a Unix-based operating system (e.g.,
									Linux or macOS) to run properly.
								</li>
							</ul>
						</div>

						<div>
							<span className={styles["subtitle"]}>Installation Steps</span>
							<ol className={styles["text"]}>
								<li className={styles["list-item"]}>
									<span className={styles["list-item-title"]}>
										Execute the configuration script.
									</span>
									<p className={styles["list-item-text"]}>
										Open your terminal or console, copy the following script,
										paste and run it.
									</p>
									<Input
										control={control}
										errors={errors}
										isLabelHidden
										isReadOnly
										label="pm2StartupScript"
										name="pm2StartupScript"
										placeholder="Need to generate API key"
										rightIcon={
											<IconButton
												iconName="clipboard"
												isDisabled={isCopyButtonDisabled}
												label="Copy script"
												onClick={handleCopyStartupScriptClick}
											/>
										}
									/>
									<span className={styles["list-item-text"]}>
										Then, modify the command output from this step with your
										system&apos;s values and execute it in terminal or console.
									</span>
								</li>
								<li className={styles["list-item"]}>
									<span className={styles["list-item-title"]}>
										Clone your project repository.
									</span>
									<p className={styles["list-item-text"]}>
										Use Git to clone your project repository to your local
										machine.
									</p>
								</li>

								<li className={styles["list-item"]}>
									<span className={styles["list-item-title"]}>
										Prepare the script.
									</span>
									<p className={styles["list-item-text"]}>
										Copy the command below and replace &lt;project-path&gt;
										placeholder with your local repository&apos;s path:
									</p>
									<Input
										control={control}
										errors={errors}
										isLabelHidden
										isReadOnly
										label="Analytics script"
										name="analyticsScript"
										placeholder="Need to generate API key"
										rightIcon={
											<IconButton
												iconName="clipboard"
												isDisabled={isCopyButtonDisabled}
												label="Copy script"
												onClick={handleCopyAnalyticsScriptClick}
											/>
										}
									/>
								</li>

								<li className={styles["list-item"]}>
									<span className={styles["list-item-title"]}>
										Execute the script.
									</span>
									<p className={styles["list-item-text"]}>
										Open your terminal or console, paste and run the modified
										script. Script will start and be saved to restart on reboot.
									</p>
								</li>
							</ol>
						</div>
					</>
				)}
				{activeTab === "githubAnalytics" && (
					<>
						<div>
							<span className={styles["subtitle"]}>Overview</span>
							<p className={styles["text"]}>
								System will fetch data from Github API, collecting statistics
								and updating analytics data every 3 hours.
							</p>
						</div>

						<div>
							<span className={styles["subtitle"]}>Configuration Steps</span>
							<ol className={styles["text"]}>
								<li className={styles["list-item"]}>
									<span className={styles["list-item-title"]}>
										Go to{" "}
										<a href="https://github.com/settings/tokens?type=beta">
											https://github.com/settings/tokens?type=beta
										</a>
										.
									</span>
									<p className={styles["list-item-text"]}>
										Go to the Github API key creation link and log in if
										necessary.
									</p>
								</li>
								<li className={styles["list-item"]}>
									<span className={styles["list-item-title"]}>
										Click Generate Token button on top.
									</span>
									<p className={styles["list-item-text"]}>
										Confirm access, input desired token name, expiration date
										and desired repository access.
									</p>
								</li>

								<li className={styles["list-item"]}>
									<span className={styles["list-item-title"]}>
										Add necessary permissions
									</span>
									<p className={styles["list-item-text"]}>
										Add read-only repository permissions for commit statuses,
										contents, discussions, issues, pull requests and metadata.
									</p>
								</li>

								<li className={styles["list-item"]}>
									<span className={styles["list-item-title"]}>
										Copy and paste API token here
									</span>
									<p className={styles["list-item-text"]}>
										Click Generate Token button, copy it, and paste into the
										form here.
									</p>
								</li>
							</ol>
						</div>
						<form
							className={styles["api-key-container"]}
							onSubmit={handleAnalyticsSubmit}
						>
							<Input
								control={analyticsControl}
								errors={analyticsErrors}
								label="Github API key"
								name="apiKey"
								placeholder="API key"
							/>

							<Input
								control={analyticsControl}
								errors={analyticsErrors}
								label="Repository URL (owner/repoName)"
								name="repositoryUrl"
								placeholder="owner/repoName"
							/>
							<div className={styles["button-wrapper"]}>
								<Button label="Submit" type="submit" />
							</div>
						</form>
					</>
				)}
			</div>
		</Modal>
	);
};

export { SetupAnalyticsModal };
