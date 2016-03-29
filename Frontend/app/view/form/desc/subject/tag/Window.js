/**
 * Окно с результатами поиска тегов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.tag.Window',
	{
		extend: 'FBEditor.view.form.desc.searchField.Window',
		requires: [
			'FBEditor.view.form.desc.subject.tag.WindowController',
			'FBEditor.view.container.desc.search.tag.Tag'
		],
		id: 'form-desc-tag',
		xtype: 'form-desc-tag',
		controller: 'form.desc.tag',

		width: 400,

		xtypeContainerItems: 'container-desc-search-tag',

		displayField: 'value',

		/**
		 * @property {FBEditor.view.form.desc.subject.Subject} Поле жанра.
		 */
		subjectField: null,

		/**
		 * Устанавливает связь с полем ввода.
		 * @param {FBEditor.view.form.desc.subject.Subject} field
		 */
		setSubjectField: function (field)
		{
			var me = this,
				containerTags = me.getContainerItems();

			if (!me.cacheEvent)
			{
				me.cacheEvent = true;

				containerTags.on(
					{
						scope: me,
						afterLoad: me.afterLoadTags
					}
				);
			}

			me.subjectField = field;
			me.searchField = me.getTextField();
		},

		/**
		 * Показывает окно с результатми поиска тегов.
		 */
		showTags: function()
		{
			var me = this,
				textfield = me.getTextField(),
				val = textfield.getValue();

			if (val.length > 1)
			{
				me.clean();

				// делаем запрос
				me.fireEvent('loadData', {term: val});
			}
			else
			{
				me.abort();
			}
		},

		/**
		 * @private
		 * Возвращает текстовое поле.
		 * @return {FBEditor.view.form.desc.subject.field.SubjectField}
		 */
		getTextField: function ()
		{
			return this.subjectField.down('form-desc-subject-field');
		},

		/**
		 * @private
		 * Вызывается после загрузки данных тегов.
		 * @param {Array} data Данные.
		 */
		afterLoadTags: function (data)
		{
			var me = this,
				val = me.getTextField().getValue().toLowerCase(),
				onlyOne;

			if (data && data.length)
			{
				if (!me.isShow)
				{
					onlyOne = data.length == 1 ? data[0][me.displayField].toLowerCase() : false;
					onlyOne = onlyOne ? onlyOne.replace(/<\/?b>/ig, '') : false;

					if (onlyOne &&  onlyOne === val)
					{
						// не показываем окно в случае, если в списке единственное значение равное значению в поле
					}
					else
					{
						me.show();
					}
				}
			}
			else
			{
				me.close();
			}
		}
	}
);