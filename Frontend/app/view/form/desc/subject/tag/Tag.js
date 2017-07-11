/**
 * Контейнер с результатами поиска тегов.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.tag.Tag',
	{
		extend: 'FBEditor.view.form.desc.searchField.Window',
		requires: [
			'FBEditor.view.form.desc.subject.tag.TagController',
			'FBEditor.view.container.desc.search.tag.Tag'
		],

		xtype: 'form-desc-subject-tag',
		controller: 'form.desc.subject.tag',

		floating: false,
		scrollable: false,

		xtypeContainerItems: 'container-desc-search-tag',

		displayField: 'value',

		/**
		 * @private
		 * @property {FBEditor.view.form.desc.subject.window.Window} Окно с жанрами и тегами.
		 */
		win: null,

		afterRender: function ()
		{
			var me = this,
				containerTags = me.getContainerItems();

			// регистрируем обработчик события окончания поиска тегов
			containerTags.on(
				{
					scope: me,
					afterLoad: me.afterLoadTags
				}
			);

			// связываем поле
			me.searchField = me.getSubjectField();

			me.callParent(arguments);
		},

		/**
		 * Показывает результаты поиска тегов.
		 */
		showTags: function()
		{
			var me = this,
				subjectField = me.getSubjectField(),
				val = subjectField.getValue();

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
		 * Возвращает окно (родительский контейнер).
		 * @return {FBEditor.view.form.desc.subject.window.Window}
		 */
		getWindow: function ()
		{
			var me = this,
				win;

			win  = me.win || me.up('form-desc-subject-win');
			me.win = win;

			return win;
		},

		/**
		 * Обновляет размеры контейнера в соответствии с размерами окна и содержимого.
		 */
		updateSize: function ()
		{
			var me = this,
				win = me.getWindow();

			me.setWidth(win.getWidth());
		},

		/**
		 * Корректирует размеры контейнера в зависимости от содержимого.
		 */
		onResizeContainerItems: function ()
		{
			var me = this,
				containerItems = me.getContainerItems(),
				heightPersons = containerItems.getHeight();

			// регулируем высоту контейнера по высоте содержимого
			me.setHeight(heightPersons);
		},

		/**
		 * @private
		 * Возвращает текстовое поле.
		 * @return {FBEditor.view.form.desc.subject.field.SubjectField}
		 */
		getSubjectField: function ()
		{
			var me = this,
				win = me.getWindow(),
				subject = win.getSubject();
			
			return subject.getSubjectField();
		},

		/**
		 * @private
		 * Вызывается после загрузки данных тегов.
		 * @param {Array} data Данные.
		 */
		afterLoadTags: function (data)
		{
			var me = this,
				subjectField = me.getSubjectField(),
				val = subjectField.getValue().toLowerCase(),
				onlyOne;

			me.show();

			/*
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
				//me.close();
			}
			*/
		},

		afterShow: function()
		{
			//
		},

		afterHide: function ()
		{
			//
		},

		onEsc: function ()
		{
			//
		},

		onClickBody: function (e, input)
		{
			//
		}
	}
);