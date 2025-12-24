<div class="acp-page-container">
	<!-- IMPORT admin/partials/settings/header.tpl -->
	<form class="form discord-notification-settings">
		<div class="row">
			<div class="col-sm-2 col-12 settings-header">[[discord-notification:webhook]]</div>
			<div class="col-sm-10 col-12">
				<div class="form-group">
					<label for="webhookURL">[[discord-notification:webhook-url]]</label>
					<input type="text" class="form-control" id="webhookURL" name="webhookURL" />
					<p class="help-block">[[discord-notification:webhook-help]]</p>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-sm-2 col-12 settings-header">[[discord-notification:notification]]</div>
			<div class="col-sm-10 col-12">
				<div class="form-group">
					<label for="maxLength">[[discord-notification:notification-max-length]]</label>
					<input type="number" class="form-control" id="maxLength" name="maxLength" min="1" max="1024" value="100" />
					<p class="help-block">[[discord-notification:notification-max-length-help]]</p>
				</div>
				<div class="mb-3">
					<div class="post-search-item">
						<label class="form-label">[[discord-notification:post-categories]]</label>
						<select multiple class="form-select" id="postCategories" name="postCategories" size="20">
							<!-- BEGIN allCategories -->
							<option value="{allCategories.value}" <!-- IF allCategories.selected -->selected<!-- ENDIF allCategories.selected -->>{allCategories.text}</option>
							<!-- END allCategories -->
						</select>
					</div>
				</div>
				<div class="form-check form-switch mb-3">
					<input class="form-check-input" type="checkbox" id="topicsOnly" name="topicsOnly" />
					<label class="form-check-label" for="topicsOnly">[[discord-notification:topics-only]]</label>
				</div>
				<div class="form-group mb-3">
					<label for="messageContent">[[discord-notification:message]] <small>([[discord-notification:message-sidenote]])</small></label>
					<textarea class="form-control" id="messageContent" name="messageContent" maxlength="512"></textarea>
					<p class="help-block">[[discord-notification:message-help]]</p>
				</div>
			</div>
		</div>
	</form>
</div>