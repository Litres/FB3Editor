/**
 * Таблица преобразований XSLT для получения промежуточной строки, из которой будет создан контент редактора текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.xsl.Editor',
	{
		singleton: true,

		/**
		 * Вовзращает xsl для преобразования xml в json.
		 * @return {String} Строка xsl
		 */
		getXsl: function ()
		{
			var xsl;

			xsl = '\
<?xml version="1.0" encoding="UTF-8"?>\
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">\
	<xsl:output encoding="UTF-8" indent="no" method="text"/>\
	<xsl:template match="*">\
		ce(\'<xsl:value-of select="name()"/>\', {<xsl:if test="@*"><xsl:apply-templates select="@*"/></xsl:if>}<xsl:if test="* or .">, [<xsl:apply-templates/>]</xsl:if>)<xsl:if test="position()!=last()">, </xsl:if>\
	</xsl:template>\
	<xsl:template match="text()">\
		<xsl:if test="normalize-space() or string()=\' \'">\
			ct(\'<xsl:value-of select="."/>\')\
			<xsl:if test="position()!=last()">, </xsl:if>\
		</xsl:if>\
	</xsl:template>\
	<xsl:template match="@*">\'<xsl:value-of select="local-name()"/>\': \'<xsl:value-of select="."/>\'<xsl:if test="position()!=last()">, </xsl:if></xsl:template>\
</xsl:stylesheet>\
			';

			return xsl;
		}
	}
);