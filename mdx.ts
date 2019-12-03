import remark from 'remark';
import mdxMetaData from 'remark-mdx-metadata';
import mdToMdxast from 'remark-mdx';


export const parserMdx = (file) => {
  let res;

  return remark()
    .use(mdToMdxast)
    .use(mdxMetaData)
    .process(
      file,
      (err, vfile: {
        data: any;
        contents: any;
      }) => {
        if (err) throw err;

        res = {
          frontmatter: vfile.data.frontmatter,
          content: String(vfile.contents)
        };
      }
    );
};
