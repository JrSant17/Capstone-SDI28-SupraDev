import PropTypes from 'prop-types';
import { useCookies, CookiesProvider } from 'react-cookie';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';

import { SocialPostAdd } from './social-post-add';
import { SocialPostCard } from './social-post-card';
import { SocialAbout } from './social-about';

export const SocialTimeline = (props) => {
  const { id } = useParams();
  const { posts = [], profile, ...other } = props;
  const [sessionCookies, setSessionCookies, removeSessionCookies] = useCookies([
    'username_token',
    'user_id_token',
    'userPriv_Token',
  ]);
  const [userObj, setUserObj] = useState([]);
  const [chatPosts, setChatPosts] = useState([]);

  const userRefetch = async () => {
    const userId = id ? id : sessionCookies.user_id_token;
    await fetch(`http://localhost:8080/users/${userId}`)
      .then((res) => res.json())
      .then((fetchData) => setUserObj(fetchData));
  };

  useEffect(() => {
    userRefetch();
  }, [id]);

  const postFetch = async () => {
    const userId = id ? id : sessionCookies.user_id_token;
    await fetch(`http://localhost:8080/users/${userId}`)
      .then((res) => res.json())
      .then((fetchData) => setChatPosts(fetchData[0]));
  };

  useEffect(() => {
    postFetch();
  }, [id]);

  return (
    <div {...other}>
      <Grid container spacing={4}>
        <Grid lg={4} xs={12}>
          <SocialAbout
            job_title={userObj.job_title}
            email={userObj.email}
            quote={userObj.user_summary}
            languages={userObj.languages}
            operating_systems={userObj.operating_systems}
            experience={userObj.experience}
            time_available={userObj.time_available}
            availability={userObj.availability}
          />
        </Grid>
        <Grid lg={8} xs={12}>
          <Stack spacing={3}>
            <SocialPostAdd
              authorAvatar={userObj.profile_pic}
              authorName={userObj.first_name + " " + userObj.last_name}
            />
            {posts.map((post) => (
              <SocialPostCard
                key={post.id}
                authorAvatar={userObj.profile_pic}
                authorName={userObj.first_name + " " +userObj.last_name}
                comments={post.comments}
                createdAt={post.createdAt}
                isLiked={post.isLiked}
                likes={post.likes}
                media={post.media}
                message={post.message}
              />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
};

SocialTimeline.propTypes = {
  posts: PropTypes.array,
  profile: PropTypes.object.isRequired,
};
