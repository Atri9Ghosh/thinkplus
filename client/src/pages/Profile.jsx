import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, Mail, Phone, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
});

const Profile = () => {
  const { userId, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      if (!userId) {
        setLoading(false);
        return;
      }
      
      const data = await userService.getUserProfile(userId);
      setProfile(data.user);
      reset({
        name: data.user?.name || '',
        phoneNumber: data.user?.phoneNumber || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      if (!userId) {
        toast.error('User not authenticated');
        return;
      }
      
      await userService.updateUserProfile(userId, data);
      toast.success('Profile updated successfully!');
      await loadProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile Settings</h1>
          <p className="text-text-secondary">Manage your account information</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Image */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center">
                {profile?.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile?.name || 'User'}</h2>
                <p className="text-text-secondary">{profile?.email || user?.primaryEmailAddress?.emailAddress}</p>
                {profile?.role && (
                  <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </span>
                )}
              </div>
            </div>

            {/* Name */}
            <Input
              label="Full Name"
              icon={User}
              {...register('name')}
              error={errors.name?.message}
            />

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <input
                  type="email"
                  value={profile?.email || user?.primaryEmailAddress?.emailAddress || ''}
                  disabled
                  className="w-full px-4 pl-10 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-text-secondary cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-text-secondary">Email cannot be changed</p>
            </div>

            {/* Phone Number */}
            <Input
              label="Phone Number"
              icon={Phone}
              type="tel"
              {...register('phoneNumber')}
              error={errors.phoneNumber?.message}
            />

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" variant="primary" loading={saving}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

