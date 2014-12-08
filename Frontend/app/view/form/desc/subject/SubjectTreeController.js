/**
 * Контроллер панели дерева списка жанров.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.SubjectTreeController',
	{
		extend: 'Ext.app.ViewController',
		alias: 'controller.form.desc.subjectTree',

		/**
		 * @event selectSubject Выбрасывает событие по факту выбранного жанра.
		 * Вызывается при клике на одном из элементов узла дерева.
		 * @param {Object} evt Объект события.
		 */
		onClick: function (evt)
		{
			var me = this,
				leaf = evt.target,
				view = me.getView(),
				subjectView,
				data;

			data = me.getDataLeaf(leaf);
			if (data)
			{
				subjectView = view.subjectView;
				subjectView.fireEvent('selectSubject', data);
				view.close();
			}

			// останавливаем всплытие события, чтобы не допустить закрытия окна
			evt.stopPropagation();
		},

		/**
		 * Возвращает данные выбранного жанра.
		 * @param {HTMLElement} leaf лист дерева жанров.
		 * @return {Object} Возвращает данные жанра или null, если выбран некорректный узел дерева.
		 * @return {String} Object.name Название жанра.
		 * @return {String} Object.value Значение жанра.
		 */
		getDataLeaf: function (leaf)
		{
			var data = null,
				text = leaf.innerHTML,
				tmp;

			tmp = text.match(/^(.*?) \((.*?)\)$/);
			if (tmp && tmp[1] && tmp[2])
			{
				data = {
					name: tmp[1],
					value: tmp[2]
				};
			}

			return data;
		}
	}
);